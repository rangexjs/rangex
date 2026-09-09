import { handleCaretMenuOverlayAppearance } from "../_Utilities";
import { getEmojiQuery } from "./_Utilities";
import type { ConfigureEmojiParams } from "./ConfigureEmoji-types";
import { handleEmojiAutoComplete } from "./HandleEmojiAutoComplete";
import { handleEmojiSelect } from "./HandleEmojiSelect";

export const configureEmoji = ({
	configPort,
	editorAPI,
}: ConfigureEmojiParams) => {
	const selectCleanup = handleEmojiSelect({
		configPort,
		editorAPI,
	});

	const autoCompleteCleanup = handleEmojiAutoComplete({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuOverlayAppearance({
		port: configPort,
		editorAPI,
		getQuery: ({ editorAPI, fromText, fromOffset }) =>
			getEmojiQuery({
				editorAPI,
				fromText,
				fromOffset,
				hasClosingColon: false,
			}),
		onQuery(query) {
			configPort.updateState({ query });
			return !!configPort.filteredItems.length;
		},
	});

	return () => {
		selectCleanup();
		autoCompleteCleanup();
		caretMenuCleanup();
	};
};
