import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleBlockQuoteToolbarButtonStateParams } from "./HandleBlockQuoteToolbarButtonState-types";

export const handleBlockQuoteToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuoteToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.blockQuote],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				blockQuote: { disabled: !canWrap },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
