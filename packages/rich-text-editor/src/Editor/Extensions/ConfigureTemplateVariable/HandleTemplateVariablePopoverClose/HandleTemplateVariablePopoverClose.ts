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
	editorPort,
	editorAPI,
}: RestoreFocusOnEscapeParams) => {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!editorPort.popover.isMounted) {
			return;
		}

		editorPort.popover.unmount();

		editorAPI.focus();
	};

	document.addEventListener("keydown", listener);

	return () => document.removeEventListener("keydown", listener);
};

/**
 * Hides the popover whenever the editor selection changes.
 */
const closeOnSelectionChange = ({
	editorPort,
	editorAPI,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!editorPort.popover.isMounted) {
				return;
			}

			editorPort.popover.unmount();
		},
	});
};

/**
 * Hides the popover when the editor loses focus.
 */
const closeOnEditorBlur = ({
	editorPort,
	editorAPI,
}: CloseOnEditorBlurParams) => {
	return editorAPI.subscribeEditorEvent({
		type: selectionOutEventType,
		callback: () => {
			if (!editorPort.popover.isMounted) {
				return;
			}

			const popover = editorPort.popover.element;
			const root = popover.getRootNode();

			if (!(root instanceof ShadowRoot)) {
				throw new Error("Popover root is not a ShadowRoot.");
			}

			if (popover.contains(root.activeElement)) {
				return;
			}

			editorPort.popover.unmount();
		},
	});
};

/**
 * Wires up all popover close behaviors: selection-driven close, editor blur close, and Escape key handling.
 */
export const handleTemplateVariablePopoverClose = ({
	editorPort,
	editorAPI,
}: HandleTemplateVariablePopoverCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorPort,
		editorAPI,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({
		editorPort,
		editorAPI,
	});
	const unsubscribeEscape = restoreFocusOnEscape({ editorPort, editorAPI });

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
