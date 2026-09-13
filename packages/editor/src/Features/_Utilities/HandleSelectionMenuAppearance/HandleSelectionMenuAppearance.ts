import { editorSelectionChangeEventType } from "rich-text-area";
import { createPopoverOverlayController } from "#engine-links";
import type {
	HandleSelectionMenuAppearanceParams,
	HandleSelectionMenuAppearanceResult,
} from "./HandleSelectionMenuAppearance-types";

/*
 * Wires a selection menu popover to the engine, hiding it whenever the selection changes and
 * toggling selection highlighting as the popover opens and closes.
 */
export const handleSelectionMenuAppearance = ({
	configPort,
	editorAPI,
	preventHighlight = false,
}: HandleSelectionMenuAppearanceParams): HandleSelectionMenuAppearanceResult => {
	const selection = editorAPI.getEditorSelection();

	const selectionMenuPopoverController = createPopoverOverlayController({
		element: configPort.selectionMenu,
		options: {
			lightDismiss: true,
			closeOnEscape: true,
			onToggle: (open) => {
				configPort.emitSelectionMenuToggle();

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

	const unsubscribeCloseSelectionMenu = configPort.onCloseSelectionMenu(() => {
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
