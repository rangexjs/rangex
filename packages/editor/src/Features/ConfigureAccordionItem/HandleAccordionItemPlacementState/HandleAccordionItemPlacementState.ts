import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleAccordionItemPlacementStateParams } from "./HandleAccordionItemPlacementState-types";

/*
 * Keeps the accordion item toolbar button's insert/wrap availability and active state in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleAccordionItemPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleAccordionItemPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.accordionItem],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.accordionItem],
			});

			const closestComponent = componentLookup.closestBySelection({
				components: [componentsName.accordionItem],
			});
			const isActive = closestComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});
};
