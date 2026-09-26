import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import type { HandleCodeBlockPlacementStateParams } from "./HandleCodeBlockPlacementState-types";

/*
 * Keeps the code block toolbar button's insert/wrap availability and active state in sync with
 * the current selection and the editor content. Returns a cleanup function.
 */
export const handleCodeBlockPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
	blockComponentPlacement,
}: HandleCodeBlockPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const canInsert = blockComponentPlacement.canInsertBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.codeBlock],
			});
			const canWrap = blockComponentPlacement.canWrapBySelection({
				scope: "nearest-multi-line",
				allowedComponents: [componentsName.codeBlock],
			});

			const codeBlockComponent = componentLookup.closestBlockBySelection({
				components: [componentsName.codeBlock],
			});
			const isActive = codeBlockComponent !== null;

			configPort.updateState({ canInsert, canWrap, isActive });
		},
	});
};
