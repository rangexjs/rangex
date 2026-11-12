import { editorSelectionChangeEventType } from "@rangex/core";

import { createPopoverOverlayController } from "#engine-links";

import type {
	HandleSelectionMenuInteractionParams,
	HandleSelectionMenuInteractionResult,
} from "./HandleSelectionMenuInteraction-types";

/*
 * Wires a selection menu popover to the engine, hiding it whenever the selection changes and
 * toggling selection highlighting as the popover opens and closes.
 */
export const handleSelectionMenuInteraction = ({
	configPort,
	editorAPI,
	preventHighlight = false,
}: HandleSelectionMenuInteractionParams): HandleSelectionMenuInteractionResult => {
	const selection = editorAPI.getEditorSelection();

	const selectionMenuPopoverController = createPopoverOverlayController({
		element: configPort.element,
		options: {
			lightDismiss: true,
			closeOnEscape: true,
			onToggle: (open) => {
				configPort.notifyToggle();

				if (!preventHighlight) {
					selection.highlight = open;
				}
			},
			onEscape: () => {
				editorAPI.focus();
			},
		},
	});

	const unsubscribeSelectionChange = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			selectionMenuPopoverController.hide({ instant: true });
		},
	});

	const unsubscribeCloseSelectionMenu = configPort.onClose(() => {
		selectionMenuPopoverController.hide({});
	});

	const unsubscribeAddExemptNode = configPort.onAddExemptNode((node) => {
		selectionMenuPopoverController.addExemptNode(node);
	});

	const unsubscribeRemoveExemptNode = configPort.onRemoveExemptNode((node) => {
		selectionMenuPopoverController.removeExemptNode(node);
	});

	return {
		selectionMenuPopoverController,
		cleanup() {
			selectionMenuPopoverController.cleanup();
			unsubscribeSelectionChange();
			unsubscribeCloseSelectionMenu();
			unsubscribeAddExemptNode();
			unsubscribeRemoveExemptNode();
		},
	};
};
