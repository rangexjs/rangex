import { EditorRange, editorSelectionChangeEventType } from "@rangex/core";
import { observeEditorNodeAttachment } from "#engine-links";
import type {
	CloseOnLinkRemovalParams,
	CloseOnSelectionChangeParams,
	HandleLinkMenuCloseParams,
} from "./HandleLinkMenuClose-types";

/*
 * Closes the popover whenever the selection leaves the link it is anchored to or becomes non-collapsed.
 */
const closeOnSelectionChange = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: CloseOnSelectionChangeParams) => {
	const selection = editorAPI.getEditorSelection();

	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!linkMenuPopoverController.isOpen) {
				return;
			}

			const { currentComponent } = configPort;
			const { anchorElement } = linkMenuPopoverController;

			if (currentComponent && anchorElement === currentComponent) {
				const { fromText, fromOffset, toText, toOffset } =
					selection.getBoundaryPoints();

				const range = new EditorRange({
					fromNode: fromText,
					fromOffset,
					toNode: toText,
					toOffset,
				});

				// Keep the popover open only while the caret is collapsed inside its link.
				if (range.isSinglePoint) {
					return;
				}
			}

			linkMenuPopoverController.hide({});
		},
	});
};

/*
 * Closes the popover when the link it is anchored to is detached from the document (e.g. undo, external
 * removal). The controller skips the hide animation on its own for a detached anchor.
 */
const closeOnLinkRemoval = ({
	editorAPI,
	linkMenuPopoverController,
}: CloseOnLinkRemovalParams) => {
	return observeEditorNodeAttachment({
		editorAPI,
		onMutation: () => {
			const { anchorElement } = linkMenuPopoverController;

			if (!anchorElement || anchorElement.isConnected) {
				return;
			}

			linkMenuPopoverController.hide({});
		},
	});
};

/*
 * Closes the link menu popover when the selection leaves the current link or the link itself
 * is removed from the document. Returns a cleanup function.
 */
export const handleLinkMenuClose = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: HandleLinkMenuCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});
	const unsubscribeLinkRemoval = closeOnLinkRemoval({
		editorAPI,
		linkMenuPopoverController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeLinkRemoval();
	};
};
