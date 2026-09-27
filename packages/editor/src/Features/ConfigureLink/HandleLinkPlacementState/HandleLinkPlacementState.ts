import { handleSelectionContextChange } from "../../_Utilities";
import { getLinkPlacementMode } from "../_Utilities";
import type { HandleLinkPlacementStateParams } from "./HandleLinkPlacementState-types";

/*
 * Keeps the link toolbar button's insert availability in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleLinkPlacementState = ({
	configPort,
	editorAPI,
}: HandleLinkPlacementStateParams) => {
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const mode = getLinkPlacementMode({ editorAPI });
			const canInsert = mode !== null;

			configPort.updateState({ canInsert });
		},
	});
};
