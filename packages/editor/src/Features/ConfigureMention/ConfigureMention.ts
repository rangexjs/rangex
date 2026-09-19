import {
	handleCaretMenuAppearance,
	handleComponentUnwrap,
} from "../_Utilities";
import { getMentionQuery } from "./_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionSelect } from "./HandleMentionSelect";
import { loadMentionItems } from "./LoadMentionItems";

/*
 * Wires up the mention feature: loads the suggestion items, handles mention selection and
 * unwrapping, and manages the caret menu's appearance while typing an @-query. Returns a cleanup
 * function.
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

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		// TODO: resolve the component once mention unwrapping is wired up
		getComponent: () => null,
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
		unwrapCleanup();
		caretMenuCleanup();
	};
};
