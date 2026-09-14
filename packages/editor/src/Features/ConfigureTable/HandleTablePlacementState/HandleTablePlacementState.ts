import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleTablePlacementStateParams } from "./HandleTablePlacementState-types";

/*
 * Keeps the table toolbar button's enabled state in sync with whether a table can be
 * inserted at the current selection.
 */
export const handleTablePlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTablePlacementStateParams) => {
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
