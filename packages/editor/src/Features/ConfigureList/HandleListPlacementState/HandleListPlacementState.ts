import { componentsName } from "#constants";
import { handleSelectionContextChange } from "../../_Utilities";
import type { HandleListPlacementStateParams } from "./HandleListPlacementState-types";

/*
 * Keeps the list toolbar button's insert/wrap availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleListPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListPlacementStateParams) => {
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.list],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.list],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});
};
