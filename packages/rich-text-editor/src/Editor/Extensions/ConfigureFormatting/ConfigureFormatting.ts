import type { ConfigureFormattingParams } from "./ConfigureFormatting-types";
import { handleFormattingButtonState } from "./HandleFormattingButtonState";
import { handleFormattingChange } from "./HandleFormattingChange";

export const configureFormatting = ({
	editorPort,
	editorAPI,
}: ConfigureFormattingParams) => {
	const formattingButtonStateCleanup = handleFormattingButtonState({
		editorPort,
		editorAPI,
	});

	const formattingChangeCleanup = handleFormattingChange({
		editorPort,
		editorAPI,
	});

	return () => {
		formattingButtonStateCleanup();
		formattingChangeCleanup();
	};
};
