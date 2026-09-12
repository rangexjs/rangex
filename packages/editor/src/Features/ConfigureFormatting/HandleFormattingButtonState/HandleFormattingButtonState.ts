import { selectionStylesChangeEventType } from "rich-text-area";
import { getFormattingButtonState } from "#engine-links";
import type { HandleFormattingButtonStateParams } from "./HandleFormattingButtonState-types";

/*
 * Updates the formatting toolbar buttons' state whenever the selection's applied styles change.
 */
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
