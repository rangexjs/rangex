import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleListPlacementStateParams } from "./HandleListPlacementState-types";

/*
 * Keeps the list toolbar button's insert/wrap availability and active state in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleListPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleListPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.list],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.list],
			});

			const closestComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.list],
			});
			const isActive = closestComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});
};
