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
	emojiPopover,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = emojiPopover;

	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!popover.matches(":popover-open")) {
			return;
		}

		popover.hidePopover();

		editorAPI.focus();
	};

	document.addEventListener("keydown", listener);

	return () => document.removeEventListener("keydown", listener);
};

/**
 * Hides the popover whenever the editor selection changes.
 */
const closeOnSelectionChange = ({
	emojiPopover,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	const { popover } = emojiPopover;

	return editorAPI.subscribeEditorEvent({
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
	emojiPopover,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	const { popover } = emojiPopover;

	return editorAPI.subscribeEditorEvent({
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
	const { emojiPopover } = richTextEditorUI;

	const unsubscribeSelectionChange = closeOnSelectionChange({
		emojiPopover,
		editorAPI,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({ emojiPopover, editorAPI });
	const unsubscribeEscape = restoreFocusOnEscape({ emojiPopover, editorAPI });

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
