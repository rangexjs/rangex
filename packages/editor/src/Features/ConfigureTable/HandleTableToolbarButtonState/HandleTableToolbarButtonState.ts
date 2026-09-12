import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleTableToolbarButtonStateParams } from "./HandleTableToolbarButtonState-types";

/*
 * Keeps the table toolbar button's enabled state in sync with whether a table can be
 * inserted at the current selection.
 */
export const handleTableToolbarButtonState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTableToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.table],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
