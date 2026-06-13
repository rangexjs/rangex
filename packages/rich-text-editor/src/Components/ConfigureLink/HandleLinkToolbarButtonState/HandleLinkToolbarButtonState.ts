import { editorSelectionChangeEventType } from "rich-text-area";
import { getLinkInsertionMode } from "../_Utilities";
import type { HandleLinkToolbarButtonStateParams } from "./HandleLinkToolbarButtonState-types";

/**
 * Keeps the link button disabled when the selection is in a context that doesn't allow link insertion.
 */
export const handleLinkToolbarButtonState = ({
	richTextEditorUI,
	editorAPI,
}: HandleLinkToolbarButtonStateParams) => {
	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const mode = getLinkInsertionMode({ editorAPI });

			richTextEditorUI.updateNodeInsertionButtonState({
				anchor: { disabled: mode === null },
			});
		},
	});
};
