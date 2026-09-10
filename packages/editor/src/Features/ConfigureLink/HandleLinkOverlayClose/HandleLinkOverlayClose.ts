import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	CloseOverlayParams,
	HandleLinkOverlayCancelParams,
	HandleLinkOverlayCloseParams,
	HandleLinkOverlayUnwrapParams,
} from "./HandleLinkOverlayClose-types";

/**
 * Resets `internals.currentLink`/`selection.highlight` and hides the popover.
 */
const closeOverlay = ({
	editorAPI,
	internals,
	popoverController,
}: CloseOverlayParams) => {
	const selection = editorAPI.getEditorSelection();

	selection.highlight = false;
	internals.currentLink = null;
	popoverController.hide();
};

/**
 * Closes the popover whenever the selection moves outside the current link or becomes
 * non-collapsed.
 */
const closeOnSelectionChange = ({
	editorAPI,
	internals,
	popoverController,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!popoverController.isOpen) {
				return;
			}

			const { currentLink } = internals;

			if (currentLink) {
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
				if (currentLink.contains(range.startText) && range.isSinglePoint) {
					return;
				}
			}

			closeOverlay({ editorAPI, internals, popoverController });
		},
	});
};

const handleLinkOverlayUnwrap = ({
	configPort,
	editorAPI,
	internals,
	popoverController,
}: HandleLinkOverlayUnwrapParams) => {
	return configPort.onUnwrap(() => {
		closeOverlay({ editorAPI, internals, popoverController });
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles
 * transitioning back to preview instead of closing.
 */
const handleLinkOverlayCancel = ({
	configPort,
	editorAPI,
	internals,
	popoverController,
}: HandleLinkOverlayCancelParams) => {
	return configPort.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		closeOverlay({ editorAPI, internals, popoverController });
	});
};

export const handleLinkOverlayClose = ({
	configPort,
	editorAPI,
	internals,
	popoverController,
}: HandleLinkOverlayCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorAPI,
		internals,
		popoverController,
	});
	const unsubscribeUnwrap = handleLinkOverlayUnwrap({
		configPort,
		editorAPI,
		internals,
		popoverController,
	});
	const unsubscribeCancel = handleLinkOverlayCancel({
		configPort,
		editorAPI,
		internals,
		popoverController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeUnwrap();
		unsubscribeCancel();
	};
};
