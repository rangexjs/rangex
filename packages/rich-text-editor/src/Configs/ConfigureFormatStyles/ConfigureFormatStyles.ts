import { selectionStylesChangeEventType } from "rich-text-area";
import {
	getFormatStylesButtonState,
	getSelectionStylesData,
} from "../../SelectionStyle";
import type { ConfigureFormatStylesParams } from "./ConfigureFormatStyles-types";

export const configureFormatStyles = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureFormatStylesParams) => {
	const unsubscribeSelectionStyles = editorAPI.subscribeEditorEvent({
		type: selectionStylesChangeEventType,
		callback: ({ selectionFormatStyles }) => {
			const formatStylesButtonState = getFormatStylesButtonState({
				selectionFormatStyles,
			});

			richTextEditorUI.updateFormatStylesButtonState(formatStylesButtonState);
		},
	});

	const unsubscribeFormatStyles = richTextEditorUI.onFormatStyles(
		(formatStylesActionState) => {
			const selectionStylesData = getSelectionStylesData({
				formatStylesActionState,
				whenMixed: "apply",
			});

			editorAPI.updateSelectionStyles(selectionStylesData);

			editorAPI.focus();
		},
	);

	return () => {
		unsubscribeSelectionStyles();
		unsubscribeFormatStyles();
	};
};
