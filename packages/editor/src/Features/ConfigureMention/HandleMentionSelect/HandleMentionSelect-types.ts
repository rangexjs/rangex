import type { EditorAPI } from "@rangex/core";

import type { MentionConfigPort } from "#adapters/Mention";

export interface HandleMentionSelectParams {
	configPort: MentionConfigPort;
	editorAPI: EditorAPI;
}

export interface RemoveMentionQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveMentionQueryTextResult {
	queryFound: boolean;
}
