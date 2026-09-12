import { editorSelectionChangeEventType } from "rich-text-area";
import { createPopoverOverlayController } from "#engine-links";
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
			popover: "auto",
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
			const { element } = selectionMenuPopoverController;
			element.style.setProperty("transition", "none");
			// Forces reflow so the open (and animated) popovers disappear immediately
			element.offsetHeight;
			element.style.removeProperty("transition");
		},
	});

	return {
		selectionMenuPopoverController,
		cleanup() {
			unsubscribeSelectionChange();
		},
	};
};
