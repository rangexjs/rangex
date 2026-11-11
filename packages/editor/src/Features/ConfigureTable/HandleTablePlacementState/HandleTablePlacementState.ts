import { componentsName } from "#constants";
import { handleSelectionContextChange } from "../../_Utilities";
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
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.table],
			});

			configPort.updateState({ canInsert });
		},
	});
};
