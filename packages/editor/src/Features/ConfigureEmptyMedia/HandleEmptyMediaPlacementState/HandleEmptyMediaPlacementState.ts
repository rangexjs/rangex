import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleEmptyMediaPlacementStateParams } from "./HandleEmptyMediaPlacementState-types";

/*
 * Keeps the empty media toolbar button's insert availability in sync with the current
 * selection. Returns a cleanup function.
 */
export const handleEmptyMediaPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.emptyMedia],
			});

			configPort.updateState({ canInsert });
		},
	});

	return () => {
		unsubscribe();
	};
};
