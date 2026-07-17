import { getSelectionStylesData } from "../../../SelectionStyle";
import type { HandleFormatStylesChangeParams } from "./HandleFormatStylesChange-types";

export const handleFormatStylesChange = ({
	richTextEditorUI,
	editorAPI,
}: HandleFormatStylesChangeParams) => {
	const unsubscribe = richTextEditorUI.onFormatStyles(
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
		unsubscribe();
	};
};
