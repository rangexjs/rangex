import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleAccordionItemToolbarButtonStateParams } from "./HandleAccordionItemToolbarButtonState-types";

/*
 * Keeps the accordion item toolbar button's insert/wrap availability in sync with the current
 * selection. Returns a cleanup function.
 */
export const handleAccordionItemToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.accordionItem],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.accordionItem],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
