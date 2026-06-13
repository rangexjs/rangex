import {
	editorSelectionChangeEventType,
	selectionOutEventType,
} from "rich-text-area";
import type {
	CloseOnEditorBlurParams,
	CloseOnSelectionChangeParams,
	HandlePopoverCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandlePopoverClose-types";

/**
 * Returns focus to the editor when the user presses Escape inside the popover.
 */
const restoreFocusOnEscape = ({
	mentionPopover,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = mentionPopover;

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!popover.matches(":popover-open")) {
			return;
		}

		popover.hidePopover();

		editorAPI.focus();
	});
};

/**
 * Hides the popover whenever the editor selection changes.
 */
const closeOnSelectionChange = ({
	mentionPopover,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	const { popover } = mentionPopover;

	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!popover.matches(":popover-open")) {
				return;
			}

			popover.hidePopover();
		},
	});
};

/**
 * Hides the popover when the editor loses focus.
 */
const closeOnEditorBlur = ({
	mentionPopover,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	const { popover } = mentionPopover;

	editorAPI.subscribeEditorEvent({
		type: selectionOutEventType,
		callback: () => {
			if (!popover.matches(":popover-open")) {
				return;
			}

			const root = popover.getRootNode();

			if (!(root instanceof ShadowRoot)) {
				throw new Error("Popover root is not a ShadowRoot.");
			}

			if (popover.contains(root.activeElement)) {
				return;
			}

			popover.hidePopover();
		},
	});
};

/**
 * Wires up all popover close behaviors: selection-driven close, editor blur close, and Escape key handling.
 */
export const handlePopoverClose = ({
	richTextEditorUI,
	editorAPI,
}: HandlePopoverCloseParams) => {
	const { mentionPopover } = richTextEditorUI;

	closeOnSelectionChange({ mentionPopover, editorAPI });
	closeOnEditorBlur({ mentionPopover, editorAPI });
	restoreFocusOnEscape({ mentionPopover, editorAPI });
};
