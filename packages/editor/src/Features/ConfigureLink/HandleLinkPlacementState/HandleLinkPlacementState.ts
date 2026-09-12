import { editorSelectionChangeEventType } from "rich-text-area";
import { getLinkPlacementMode } from "../_Utilities";
import type { HandleLinkPlacementStateParams } from "./HandleLinkPlacementState-types";

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
