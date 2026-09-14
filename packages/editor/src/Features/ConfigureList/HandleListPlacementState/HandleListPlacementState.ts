import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import type { HandleListPlacementStateParams } from "./HandleListPlacementState-types";

/*
 * Updates the list toolbar button's enabled state on every selection change, based on whether
 * a list can be inserted or the selection wrapped in one.
 */
export const handleListPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				allowedComponents: [componentsName.list],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.list],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});

	return () => {
		unsubscribe();
	};
};
