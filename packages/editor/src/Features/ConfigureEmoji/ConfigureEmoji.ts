import { handleCaretMenuAppearance } from "../_Utilities";
import { getEmojiQuery } from "./_Utilities";
import type { ConfigureEmojiParams } from "./ConfigureEmoji-types";
import { handleEmojiAutoComplete } from "./HandleEmojiAutoComplete";
import { handleEmojiSelect } from "./HandleEmojiSelect";

/*
 * Wires up the emoji feature: shortcode selection, colon-triggered auto-complete and the
 * caret menu that surfaces matching emoji while typing a shortcode. Returns a cleanup function.
 */
export const configureEmoji = ({ configPort, editorAPI }: ConfigureEmojiParams) => {
	const selectCleanup = handleEmojiSelect({
		configPort,
		editorAPI,
	});

	const autoCompleteCleanup = handleEmojiAutoComplete({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuAppearance({
		port: configPort.caretMenu,
		editorAPI,
		getQuery: ({ editorAPI, fromText, fromOffset }) =>
			getEmojiQuery({
				editorAPI,
				fromText,
				fromOffset,
				hasClosingColon: false,
			}),
	});

	return () => {
		selectCleanup();
		autoCompleteCleanup();
		caretMenuCleanup();
	};
};
