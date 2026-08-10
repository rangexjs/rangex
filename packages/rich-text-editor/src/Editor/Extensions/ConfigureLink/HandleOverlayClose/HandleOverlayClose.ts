import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	CloseOverlayParams,
	HandleOverlayCancelParams,
	HandleOverlayCloseParams,
	HandleOverlayUnwrapParams,
} from "./HandleOverlayClose-types";

/**
 * Resets `internals.currentLink`/`selection.highlight` and hides the popover.
 */
const closeOverlay = ({
	editorAPI,
	internals,
	popoverController,
	hideImmediately,
}: CloseOverlayParams) => {
	const selection = editorAPI.getEditorSelection();
	selection.highlight = false;
	internals.currentLink = null;
	popoverController.hide();

	if (hideImmediately) {
		const { element } = popoverController;
		element.style.setProperty("transition", "none");
		// Forces reflow so the open (and animated) popovers disappear immediately
		element.offsetHeight;
		element.style.removeProperty("transition");
	}
};

/**
 * Closes the popover whenever the selection moves outside the current link or becomes non-collapsed.
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

				const { startText } = range;

				// Keep the popover open only while the caret is collapsed and positioned inside the link
				if (currentLink.contains(startText) && range.isSinglePoint) {
					return;
				}
			}

			closeOverlay({
				editorAPI,
				internals,
				popoverController,
				hideImmediately: true,
			});
		},
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleOverlayUnwrap = ({
	editorPort,
	editorAPI,
	internals,
	popoverController,
}: HandleOverlayUnwrapParams) => {
	return editorPort.onUnwrap(() => {
		closeOverlay({
			editorAPI,
			internals,
			popoverController,
			hideImmediately: true,
		});
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleOverlayCancel = ({
	editorPort,
	editorAPI,
	internals,
	popoverController,
}: HandleOverlayCancelParams) => {
	return editorPort.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		closeOverlay({
			editorAPI,
			internals,
			popoverController,
			hideImmediately: true,
		});
	});
};

/**
 * Wires up all popover close behaviors: selection-driven close, editor blur close, cancel handling, and escape.
 */
export const handleOverlayClose = ({
	editorPort,
	editorAPI,
	internals,
	popoverController,
}: HandleOverlayCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorAPI,
		internals,
		popoverController,
	});
	const unsubscribeUnwrap = handleOverlayUnwrap({
		editorPort,
		editorAPI,
		internals,
		popoverController,
	});
	const unsubscribeCancel = handleOverlayCancel({
		editorPort,
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
