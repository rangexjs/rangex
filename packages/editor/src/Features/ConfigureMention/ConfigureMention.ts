import { handleCaretMenuOverlayAppearance } from "../_Utilities";
import { getMentionQuery } from "./_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionSelect } from "./HandleMentionSelect";
import { loadMentionItems } from "./LoadMentionItems";

export const configureMention = ({
	configPort,
	editorAPI,
}: ConfigureMentionParams) => {
	loadMentionItems({ configPort });

	const selectCleanup = handleMentionSelect({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuOverlayAppearance({
		port: configPort,
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
