import { componentsName } from "#engine-links";
import { handleSelectionContextChange } from "../../_Utilities";
import type { HandleCodeBlockPlacementStateParams } from "./HandleCodeBlockPlacementState-types";

/*
 * Keeps the code block toolbar button's insert/wrap availability in sync with
 * the current selection and the editor content. Returns a cleanup function.
 */
export const handleCodeBlockPlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockPlacementStateParams) => {
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.codeBlock],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.codeBlock],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});
};
