import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleTableToolbarButtonStateParams } from "./HandleTableToolbarButtonState-types";

/**
 * Keeps the table button disabled when the selection is in a context that doesn't allow table insertion.
 */
export const handleTableToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleTableToolbarButtonStateParams) => {
	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.table],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				table: { disabled: !canInsert },
			});
		},
	});
};
