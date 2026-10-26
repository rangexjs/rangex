import { componentsName } from "#constants";
import { handleSelectionContextChange } from "../../_Utilities";
import type { HandleAccordionItemPlacementStateParams } from "./HandleAccordionItemPlacementState-types";

/*
 * Keeps the accordion item toolbar button's insert/wrap availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleAccordionItemPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemPlacementStateParams) => {
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.accordionItem],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.accordionItem],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});
};
