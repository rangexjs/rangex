import { selectionStylesChangeEventType } from "rich-text-area";
import { getFormatStylesButtonState } from "../../../SelectionStyle";
import type { HandleFormatStylesButtonStateParams } from "./HandleFormatStylesButtonState-types";

export const handleFormatStylesButtonState = ({
	richTextEditorUI,
	editorAPI,
}: HandleFormatStylesButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: selectionStylesChangeEventType,
		callback: ({ selectionFormatStyles }) => {
			const formatStylesButtonState = getFormatStylesButtonState({
				selectionFormatStyles,
			});

			richTextEditorUI.updateFormatStylesButtonState(formatStylesButtonState);
		},
	});

	return () => {
		unsubscribe();
	};
};
