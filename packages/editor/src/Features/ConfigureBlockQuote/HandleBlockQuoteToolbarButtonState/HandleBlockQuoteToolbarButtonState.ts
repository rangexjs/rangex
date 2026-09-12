import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleBlockQuoteToolbarButtonStateParams } from "./HandleBlockQuoteToolbarButtonState-types";

/*
 * Updates the block quote toolbar button's enabled state on every selection change,
 * based on whether a block quote can be inserted or the selection wrapped in one.
 */
export const handleBlockQuoteToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuoteToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.blockQuote],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.blockQuote],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
