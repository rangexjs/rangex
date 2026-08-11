import type { ConfigureShortcutsParams } from "./ConfigureShortcuts-types";
import { handleInlineFormatting } from "./HandleInlineFormatting";

export const configureShortcuts = ({ editorAPI }: ConfigureShortcutsParams) => {
	const inlineFormattingCleanup = handleInlineFormatting({ editorAPI });

	return () => {
		inlineFormattingCleanup();
	};
};
