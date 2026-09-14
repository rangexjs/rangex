import { handleCaretMenuAppearance } from "../_Utilities";
import { getMentionQuery } from "./_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionSelect } from "./HandleMentionSelect";
import { loadMentionItems } from "./LoadMentionItems";

/*
 * Wires up the mention feature: loads the suggestion items, handles mention selection, and
 * manages the caret menu's appearance while typing an @-query. Returns a cleanup function.
 */
export const configureMention = ({
	configPort,
	editorAPI,
}: ConfigureMentionParams) => {
	loadMentionItems({ configPort });

	const selectCleanup = handleMentionSelect({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuAppearance({
		port: configPort.caretMenu,
		editorAPI,
		getQuery: getMentionQuery,
		onQuery(query) {
			configPort.updateState({ query });
			return !!configPort.filteredItems.length;
		},
	});

	return () => {
		selectCleanup();
		caretMenuCleanup();
	};
};
