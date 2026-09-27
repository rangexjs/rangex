import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleBlockQuotePlacementStateParams } from "./HandleBlockQuotePlacementState-types";

/*
 * Keeps the block quote toolbar button's insert/wrap availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleBlockQuotePlacementState = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuotePlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.blockQuote],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.blockQuote],
			});

			configPort.updateState({ canInsert, canWrap });
		},
	});
};
