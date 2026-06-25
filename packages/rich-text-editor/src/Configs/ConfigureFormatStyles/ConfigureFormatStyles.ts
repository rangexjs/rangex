import type { ConfigureFormatStylesParams } from "./ConfigureFormatStyles-types";
import { handleFormatStylesButtonState } from "./HandleFormatStylesButtonState";
import { handleFormatStylesChange } from "./HandleFormatStylesChange";

export const configureFormatStyles = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureFormatStylesParams) => {
	const buttonStateCleanup = handleFormatStylesButtonState({
		richTextEditorUI,
		editorAPI,
	});

	const formatStylesChangeCleanup = handleFormatStylesChange({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		buttonStateCleanup();
		formatStylesChangeCleanup();
	};
};
