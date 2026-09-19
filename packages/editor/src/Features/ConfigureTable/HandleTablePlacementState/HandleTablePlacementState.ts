import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleTablePlacementStateParams } from "./HandleTablePlacementState-types";

/*
 * Keeps the table toolbar button's enabled state in sync with whether a table can be
 * inserted at the current selection, and reports whether the selection is inside a table.
 */
export const handleTablePlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleTablePlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.table],
			});

			const closestTable = componentLookup.closestBlockBySelection({
				components: [componentsName.table],
			});
			const isActive = closestTable !== null;

			configPort.updateState({ canInsert, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
