import { editorSelectionChangeEventType } from "rich-text-area";
import { componentsName } from "#engine-links";
import { getLinkPlacementMode } from "../_Utilities";
import type { HandleLinkPlacementStateParams } from "./HandleLinkPlacementState-types";

/*
 * Subscribes to selection changes and keeps the config port's canInsert state in sync with
 * whether the current selection can take a link, and its isActive state with whether the
 * selection is inside a link. Returns a cleanup function.
 */
export const handleLinkPlacementState = ({
	configPort,
	editorAPI,
	componentLookup,
}: HandleLinkPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const mode = getLinkPlacementMode({ editorAPI });
			const canInsert = mode !== null;

			const closestLink = componentLookup.closestInlineBySelection({
				components: [componentsName.link],
			});
			const isActive = closestLink !== null;

			configPort.updateState({ canInsert, isActive });
		},
	});

	return () => {
		unsubscribe();
	};
};
