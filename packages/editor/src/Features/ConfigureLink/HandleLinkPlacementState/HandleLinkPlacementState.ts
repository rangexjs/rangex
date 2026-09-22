import { componentsName } from "#engine-links";
import { handleComponentPlacementState } from "../../_Utilities";
import { getLinkPlacementMode } from "../_Utilities";
import type { HandleLinkPlacementStateParams } from "./HandleLinkPlacementState-types";

/*
 * Keeps the link toolbar button's insert availability and active state in sync with the current selection and the editor
 * content. Returns a cleanup function.
 */
export const handleLinkPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
}: HandleLinkPlacementStateParams) => {
	return handleComponentPlacementState({
		editorAPI,
		updateState: () => {
			const mode = getLinkPlacementMode({ editorAPI });
			const canInsert = mode !== null;

			const closestLink = componentLookup.closestInlineBySelection({
				components: [componentsName.link],
			});
			const isActive = closestLink !== null;

			configPort.updateState({ canInsert, isActive });
		},
	});
};
