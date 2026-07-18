import { EditorRange, editorSelectionChangeEventType } from "rich-text-area";
import type {
	CloseOnSelectionChangeParams,
	HandleLinkPopoverCancelParams,
	HandleLinkPopoverCloseParams,
	OnPopoverCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleLinkPopoverClose-types";

/**
 * Closes the popover whenever the selection moves outside the current link or becomes non-collapsed.
 */
const closeOnSelectionChange = ({
	linkPort,
	editorAPI,
	internals,
}: CloseOnSelectionChangeParams) => {
	const { popover } = linkPort;

	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!popover.matches(":popover-open")) {
				return;
			}

			const { currentLink } = internals;

			if (!currentLink) {
				popover.hidePopover();
				return;
			}

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

			popover.hidePopover();
		},
	});
};

/**
 * Closes the popover on cancel only in insert mode — in modify mode the UI handles transitioning back to preview.
 */
const handleLinkPopoverCancel = ({
	linkPort,
	internals,
}: HandleLinkPopoverCancelParams) => {
	const { popover } = linkPort;

	return linkPort.onCancel(() => {
		if (internals.currentLink) {
			return;
		}

		popover.hidePopover();
	});
};

/**
 * Returns focus to the editor when the user presses Escape inside the popover.
 */
const restoreFocusOnEscape = ({
	linkPort,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = linkPort;

	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		editorAPI.focus();
	};

	popover.addEventListener("keydown", listener);

	return () => popover.removeEventListener("keydown", listener);
};

/**
 * Clears currentLink whenever the popover closes, keeping internals consistent regardless of how it was dismissed.
 */
const onPopoverClose = ({
	linkPort,
	editorAPI,
	internals,
}: OnPopoverCloseParams) => {
	const { popover } = linkPort;
	const selection = editorAPI.getEditorSelection();

	const listener = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		selection.highlight = false;
		internals.currentLink = null;
	};

	popover.addEventListener("toggle", listener);

	return () => popover.removeEventListener("toggle", listener);
};

/**
 * Wires up all popover close behaviors: selection-driven close, cancel handling, and internals cleanup on toggle.
 */
export const handleLinkPopoverClose = ({
	linkPort,
	editorAPI,
	internals,
}: HandleLinkPopoverCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		linkPort,
		editorAPI,
		internals,
	});
	const unsubscribeCancel = handleLinkPopoverCancel({ linkPort, internals });
	const unsubscribeEscape = restoreFocusOnEscape({ linkPort, editorAPI });
	const unsubscribeToggle = onPopoverClose({
		linkPort,
		editorAPI,
		internals,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeCancel();
		unsubscribeEscape();
		unsubscribeToggle();
	};
};
