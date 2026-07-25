import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleTableToolbarButtonStateParams } from "./HandleTableToolbarButtonState-types";

/**
 * Keeps the table button disabled when the selection is in a context that doesn't allow table insertion.
 */
export const handleTableToolbarButtonState = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTableToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.table],
			});

			editorPort.updateState({ toolbarButton: { disabled: !canInsert } });
		},
	});

	return () => {
		unsubscribe();
	};
};
