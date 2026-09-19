import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleAccordionItemPlacementStateParams } from "./HandleAccordionItemPlacementState-types";

/*
 * Keeps the accordion item toolbar button's insert/wrap availability in sync with the current
 * selection. Returns a cleanup function.
 * Also reports whether the selection is inside the component.
 */
export const handleAccordionItemPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleAccordionItemPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.accordionItem],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.accordionItem],
			});

			const closestComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.accordionItem],
			});
			const isActive = closestComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
