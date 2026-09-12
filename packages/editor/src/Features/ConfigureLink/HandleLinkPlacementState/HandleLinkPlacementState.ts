import { editorSelectionChangeEventType } from "rich-text-area";
import { getLinkPlacementMode } from "../_Utilities";
import type { HandleLinkPlacementStateParams } from "./HandleLinkPlacementState-types";

/*
 * Subscribes to selection changes and keeps the config port's canInsert state in sync with
 * whether the current selection can take a link. Returns a cleanup function.
 */
export const handleLinkPlacementState = ({
	configPort,
	editorAPI,
}: HandleLinkPlacementStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const mode = getLinkPlacementMode({ editorAPI });

			configPort.updateState({ canInsert: mode !== null });
		},
	});

	return () => {
		unsubscribe();
	};
};
