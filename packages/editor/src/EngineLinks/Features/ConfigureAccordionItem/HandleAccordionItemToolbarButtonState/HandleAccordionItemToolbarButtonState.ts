import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleAccordionItemToolbarButtonStateParams } from "./HandleAccordionItemToolbarButtonState-types";

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
