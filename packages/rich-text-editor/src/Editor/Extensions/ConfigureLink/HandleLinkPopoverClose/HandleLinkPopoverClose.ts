import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	ClosePopoverParams,
	HandleLinkPopoverCancelParams,
	HandleLinkPopoverCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleLinkPopoverClose-types";

/**
 * Resets `internals.currentLink`/`selection.highlight` and hides the popover.
 */
const closePopover = ({
	editorPort,
	editorAPI,
	internals,
}: ClosePopoverParams) => {
	const selection = editorAPI.getEditorSelection();
	selection.highlight = false;
	internals.currentLink = null;
	editorPort.popover.unmount();
};

/**
 * Closes the popover whenever the selection moves outside the current link or becomes non-collapsed.
 */
const closeOnSelectionChange = ({
	editorPort,
	editorAPI,
	internals,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!editorPort.popover.isMounted) {
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

			closePopover({ editorPort, editorAPI, internals });
		},
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleLinkPopoverCancel = ({
	editorPort,
	editorAPI,
	internals,
}: HandleLinkPopoverCancelParams) => {
	return editorPort.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		closePopover({ editorPort, editorAPI, internals });
	});
};

/**
 * Dismisses the popover and returns focus to the editor when the user presses Escape while it's open.
 */
const restoreFocusOnEscape = ({
	editorPort,
	editorAPI,
	internals,
}: RestoreFocusOnEscapeParams) => {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!editorPort.popover.isMounted) {
			return;
		}

		closePopover({ editorPort, editorAPI, internals });

		editorAPI.focus();
	};

	document.addEventListener("keydown", listener);

	return () => document.removeEventListener("keydown", listener);
};

/**
 * Wires up all popover close behaviors: selection-driven close, cancel handling, and escape.
 */
export const handleLinkPopoverClose = ({
	editorPort,
	editorAPI,
	internals,
}: HandleLinkPopoverCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorPort,
		editorAPI,
		internals,
	});
	const unsubscribeCancel = handleLinkPopoverCancel({
		editorPort,
		editorAPI,
		internals,
	});
	const unsubscribeEscape = restoreFocusOnEscape({
		editorPort,
		editorAPI,
		internals,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeCancel();
		unsubscribeEscape();
	};
};
