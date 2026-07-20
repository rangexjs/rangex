import { getSelectionStylesData } from "../../../SelectionStyle";
import type { HandleFormattingChangeParams } from "./HandleFormattingChange-types";

export const handleFormattingChange = ({
	editorPort,
	editorAPI,
}: HandleFormattingChangeParams) => {
	const unsubscribe = editorPort.onFormattingChange((formattingActionState) => {
		const selectionStylesData = getSelectionStylesData({
			formattingActionState,
			whenMixed: "apply",
		});

		editorAPI.updateSelectionStyles(selectionStylesData);

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
