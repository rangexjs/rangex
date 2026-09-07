import type { ConfigureFormattingParams } from "./ConfigureFormatting-types";
import { handleFormattingButtonState } from "./HandleFormattingButtonState";
import { handleFormattingChange } from "./HandleFormattingChange";

export const configureFormatting = ({
	configPort,
	editorAPI,
}: ConfigureFormattingParams) => {
	const formattingButtonStateCleanup = handleFormattingButtonState({
		configPort,
		editorAPI,
	});

	const formattingChangeCleanup = handleFormattingChange({
		configPort,
		editorAPI,
	});

	return () => {
		formattingButtonStateCleanup();
		formattingChangeCleanup();
	};
};
