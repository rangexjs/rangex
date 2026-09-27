import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleTablePlacementStateParams } from "./HandleTablePlacementState-types";

/*
 * Keeps the table toolbar button's insert availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleTablePlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTablePlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.table],
			});

			configPort.updateState({ canInsert });
		},
	});
};
