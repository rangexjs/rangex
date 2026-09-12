import { editorSelectionChangeEventType } from "rich-text-area";
import { createPopoverOverlayController } from "#engine-links";
import { forceReflowWithoutTransition } from "#utilities";
import type {
	HandleSelectionMenuAppearanceParams,
	HandleSelectionMenuAppearanceResult,
} from "./HandleSelectionMenuAppearance-types";

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
		},
	});

	const unsubscribeSelectionChange = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			selectionMenuPopoverController.hide();
			forceReflowWithoutTransition(selectionMenuPopoverController.element);
		},
	});

	return {
		selectionMenuPopoverController,
		cleanup() {
			unsubscribeSelectionChange();
		},
	};
};
