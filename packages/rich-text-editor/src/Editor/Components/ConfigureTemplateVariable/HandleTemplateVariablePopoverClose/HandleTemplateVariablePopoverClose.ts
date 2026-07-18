import {
	editorSelectionChangeEventType,
	selectionOutEventType,
} from "rich-text-area";
import type {
	CloseOnEditorBlurParams,
	CloseOnSelectionChangeParams,
	HandleTemplateVariablePopoverCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleTemplateVariablePopoverClose-types";

/**
 * Returns focus to the editor when the user presses Escape inside the popover.
 */
const restoreFocusOnEscape = ({
	templateVariablePort,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const { popover } = templateVariablePort;

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
	templateVariablePort,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	const { popover } = templateVariablePort;

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
	templateVariablePort,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	const { popover } = templateVariablePort;

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
export const handleTemplateVariablePopoverClose = ({
	templateVariablePort,
	editorAPI,
}: HandleTemplateVariablePopoverCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		templateVariablePort,
		editorAPI,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({
		templateVariablePort,
		editorAPI,
	});
	const unsubscribeEscape = restoreFocusOnEscape({
		templateVariablePort,
		editorAPI,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
