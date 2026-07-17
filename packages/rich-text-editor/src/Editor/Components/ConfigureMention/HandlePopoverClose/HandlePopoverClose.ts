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
	mentionPopover,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	const { popover } = mentionPopover;

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
	mentionPopover,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	const { popover } = mentionPopover;

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
	const { mentionPopover } = richTextEditorUI;

	const unsubscribeSelectionChange = closeOnSelectionChange({
		mentionPopover,
		editorAPI,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({
		mentionPopover,
		editorAPI,
	});
	const unsubscribeEscape = restoreFocusOnEscape({ mentionPopover, editorAPI });

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
