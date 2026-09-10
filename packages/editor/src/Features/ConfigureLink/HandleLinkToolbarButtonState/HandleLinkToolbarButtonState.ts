import { editorSelectionChangeEventType } from "rich-text-area";
import { getLinkInsertionMode } from "../_Utilities";
import type { HandleLinkToolbarButtonStateParams } from "./HandleLinkToolbarButtonState-types";

export const handleLinkToolbarButtonState = ({
	configPort,
	editorAPI,
}: HandleLinkToolbarButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const mode = getLinkInsertionMode({ editorAPI });

			configPort.updateState({ canApply: mode !== null });
		},
	});

	return () => {
		unsubscribe();
	};
};
