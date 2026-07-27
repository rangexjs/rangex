import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleAccordionItemToolbarButtonStateParams } from "./HandleAccordionItemToolbarButtonState-types";

export const handleAccordionItemToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.accordionItem],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canInsert } });
		},
	});

	return () => {
		unsubscribe();
	};
};
