import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	CloseOverlayParams,
	HandleLinkOverlayCancelParams,
	HandleLinkOverlayCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleLinkOverlayClose-types";

/**
 * Resets `internals.currentLink`/`selection.highlight` and hides the popover.
 */
const closeOverlay = ({
	editorAPI,
	internals,
	anchorController,
}: CloseOverlayParams) => {
	const selection = editorAPI.getEditorSelection();
	selection.highlight = false;
	internals.currentLink = null;
	anchorController.hide();
};

/**
 * Closes the popover whenever the selection moves outside the current link or becomes non-collapsed.
 */
const closeOnSelectionChange = ({
	editorAPI,
	internals,
	anchorController,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!anchorController.isOpen) {
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

			closeOverlay({ editorAPI, internals, anchorController });
		},
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleLinkOverlayCancel = ({
	editorPort,
	editorAPI,
	internals,
	anchorController,
}: HandleLinkOverlayCancelParams) => {
	return editorPort.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		closeOverlay({ editorAPI, internals, anchorController });
	});
};

/**
 * Dismisses the popover and returns focus to the editor when the user presses Escape while it's open.
 */
const restoreFocusOnEscape = ({
	editorAPI,
	internals,
	anchorController,
}: RestoreFocusOnEscapeParams) => {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!anchorController.isOpen) {
			return;
		}

		closeOverlay({ editorAPI, internals, anchorController });

		editorAPI.focus();
	};

	document.addEventListener("keydown", listener);

	return () => document.removeEventListener("keydown", listener);
};

/**
 * Wires up all popover close behaviors: selection-driven close, cancel handling, and escape.
 */
export const handleLinkOverlayClose = ({
	editorPort,
	editorAPI,
	internals,
	anchorController,
}: HandleLinkOverlayCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorAPI,
		internals,
		anchorController,
	});
	const unsubscribeCancel = handleLinkOverlayCancel({
		editorPort,
		editorAPI,
		internals,
		anchorController,
	});
	const unsubscribeEscape = restoreFocusOnEscape({
		editorAPI,
		internals,
		anchorController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeCancel();
		unsubscribeEscape();
	};
};
