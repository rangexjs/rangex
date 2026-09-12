import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseLinkMenuParams,
	CloseOnSelectionChangeParams,
	HandleLinkMenuCloseParams,
	HandleLinkMenuUnwrapParams,
} from "./HandleLinkMenuClose-types";

/**
 * Closes the LinkMenu.
 */
const closeLinkMenu = ({
	configPort,
	linkMenuPopoverController,
}: CloseLinkMenuParams) => {
	configPort.setCurrentComponent(null);
	linkMenuPopoverController.hide();
};

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

			closeLinkMenu({ configPort, linkMenuPopoverController });
		},
	});
};

const handleLinkMenuUnwrap = ({
	configPort,
	linkMenuPopoverController,
}: HandleLinkMenuUnwrapParams) => {
	return configPort.onUnwrap(() => {
		closeLinkMenu({ configPort, linkMenuPopoverController });
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
	const unsubscribeUnwrap = handleLinkMenuUnwrap({
		configPort,
		linkMenuPopoverController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeUnwrap();
	};
};
