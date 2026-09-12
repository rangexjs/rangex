import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import { observeEditorNodeAttachment } from "#engine-links";
import { forceReflowWithoutTransition } from "#utilities";
import type {
	CloseOnLinkRemovalParams,
	CloseOnSelectionChangeParams,
	HandleLinkMenuCloseParams,
} from "./HandleLinkMenuClose-types";

/**
 * Closes the popover whenever the selection moves outside the current link or becomes
 * non-collapsed.
 */
const closeOnSelectionChange = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!linkMenuPopoverController.isOpen) {
				return;
			}

			const { currentComponent } = configPort;

			if (currentComponent) {
				const selection = editorAPI.getEditorSelection();

				const { fromText, fromOffset, toText, toOffset } =
					selection.getBoundaryPoints();

				const range = new EditorRange({
					fromNode: fromText,
					fromOffset,
					toNode: toText,
					toOffset,
				});

				// Keep the popover open only while the caret is collapsed and inside the link.
				if (currentComponent.contains(range.startText) && range.isSinglePoint) {
					return;
				}
			}

			linkMenuPopoverController.hide();
		},
	});
};

/**
 * Closes the popover whenever the current link is detached from the RootEditable (e.g. undo,
 * external removal).
 */
const closeOnLinkRemoval = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: CloseOnLinkRemovalParams) => {
	return observeEditorNodeAttachment({
		editorAPI,
		onMutation: ({ detachedNodes }) => {
			const { currentComponent } = configPort;

			if (!currentComponent) {
				return;
			}

			if (!detachedNodes.includes(currentComponent)) {
				return;
			}

			linkMenuPopoverController.hide();
			forceReflowWithoutTransition(linkMenuPopoverController.element);
		},
	});
};

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
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeLinkRemoval();
	};
};
