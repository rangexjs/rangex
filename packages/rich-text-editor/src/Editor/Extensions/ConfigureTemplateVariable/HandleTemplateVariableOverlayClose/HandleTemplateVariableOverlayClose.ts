import {
	editorSelectionChangeEventType,
	selectionOutEventType,
} from "rich-text-area";
import type {
	CloseOnEditorBlurParams,
	CloseOnSelectionChangeParams,
	HandleTemplateVariableOverlayCloseParams,
	RestoreFocusOnEscapeParams,
} from "./HandleTemplateVariableOverlayClose-types";

/**
 * Returns focus to the editor when the user presses Escape inside the popover.
 */
const restoreFocusOnEscape = ({
	editorAPI,
	anchorController,
}: RestoreFocusOnEscapeParams) => {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== "Escape") {
			return;
		}

		if (!anchorController.isOpen) {
			return;
		}

		anchorController.hide();

		editorAPI.focus();
	};

	document.addEventListener("keydown", listener);

	return () => document.removeEventListener("keydown", listener);
};

/**
 * Hides the popover whenever the editor selection changes.
 */
const closeOnSelectionChange = ({
	editorAPI,
	anchorController,
}: CloseOnSelectionChangeParams) => {
	return editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!anchorController.isOpen) {
				return;
			}

			anchorController.hide();
		},
	});
};

/**
 * Hides the popover when the editor loses focus.
 */
const closeOnEditorBlur = ({
	editorAPI,
	anchorController,
}: CloseOnEditorBlurParams) => {
	return editorAPI.subscribeEditorEvent({
		type: selectionOutEventType,
		callback: () => {
			if (!anchorController.isOpen) {
				return;
			}

			const { element } = anchorController;
			const root = element.getRootNode();

			if (!(root instanceof ShadowRoot)) {
				throw new Error("Overlay root is not a ShadowRoot.");
			}

			if (element.contains(root.activeElement)) {
				return;
			}

			anchorController.hide();
		},
	});
};

/**
 * Wires up all popover close behaviors: selection-driven close, editor blur close, and Escape key handling.
 */
export const handleTemplateVariableOverlayClose = ({
	editorAPI,
	anchorController,
}: HandleTemplateVariableOverlayCloseParams) => {
	const unsubscribeSelectionChange = closeOnSelectionChange({
		editorAPI,
		anchorController,
	});
	const unsubscribeEditorBlur = closeOnEditorBlur({
		editorAPI,
		anchorController,
	});
	const unsubscribeEscape = restoreFocusOnEscape({
		editorAPI,
		anchorController,
	});

	return () => {
		unsubscribeSelectionChange();
		unsubscribeEditorBlur();
		unsubscribeEscape();
	};
};
