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
	mentionPort,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = mentionPort;

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
	mentionPort,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	const { popover } = mentionPort;

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
	mentionPort,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	const { popover } = mentionPort;

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
	mentionPort,
	editorAPI,
}: HandlePopoverCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		mentionPort,
		editorAPI,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({
		mentionPort,
		editorAPI,
	});
	const unsubscribeEscape = restoreFocusOnEscape({ mentionPort, editorAPI });

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
