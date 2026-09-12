import type { ConfigureShortcutsParams } from "./ConfigureShortcuts-types";
import { handleInlineFormatting } from "./HandleInlineFormatting";

/*
 * Wires up keyboard shortcut handling for inline formatting, returning a cleanup function.
 */
export const configureShortcuts = ({ editorAPI }: ConfigureShortcutsParams) => {
	const inlineFormattingCleanup = handleInlineFormatting({ editorAPI });

	return () => {
		inlineFormattingCleanup();
	};
};
