import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleListToolbarButtonStateParams } from "./HandleListToolbarButtonState-types";

export const handleListToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleListToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.list],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				orderedList: { disabled: !canWrap },
				unorderedList: { disabled: !canWrap },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
