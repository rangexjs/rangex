import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleTablePlacementStateParams } from "./HandleTablePlacementState-types";

/*
 * Keeps the table toolbar button's insert availability and active state in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleTablePlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleTablePlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
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
};
