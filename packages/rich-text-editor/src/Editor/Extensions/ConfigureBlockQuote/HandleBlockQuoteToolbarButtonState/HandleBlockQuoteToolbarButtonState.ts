import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#ports";
import type { HandleBlockQuoteToolbarButtonStateParams } from "./HandleBlockQuoteToolbarButtonState-types";

export const handleBlockQuoteToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuoteToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.blockQuote],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canWrap } });
		},
	});

	return () => {
		unsubscribe();
	};
};
