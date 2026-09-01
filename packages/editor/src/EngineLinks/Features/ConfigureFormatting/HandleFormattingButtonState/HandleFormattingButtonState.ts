import { selectionStylesChangeEventType } from "rich-text-area";
import { getFormattingButtonState } from "../../../SelectionStyle";
import type { HandleFormattingButtonStateParams } from "./HandleFormattingButtonState-types";

export const handleFormattingButtonState = ({
	configPort,
	editorAPI,
}: HandleFormattingButtonStateParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: selectionStylesChangeEventType,
		callback: ({ selectionFormatStyles }) => {
			const formattingState = getFormattingButtonState({
				selectionFormatStyles,
			});

			configPort.updateState(formattingState);
		},
	});

	return () => {
		unsubscribe();
	};
};
