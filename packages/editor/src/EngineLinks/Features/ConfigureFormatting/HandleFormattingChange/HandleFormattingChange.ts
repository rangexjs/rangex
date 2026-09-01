import { getSelectionStylesData } from "../../../SelectionStyle";
import type { HandleFormattingChangeParams } from "./HandleFormattingChange-types";

export const handleFormattingChange = ({
	configPort,
	editorAPI,
}: HandleFormattingChangeParams) => {
	const unsubscribe = configPort.onFormattingChange((formattingActionState) => {
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
