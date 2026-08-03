import type { EditorAPI } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";

export interface RemoveMentionQueryTextResult {
	queryFound: boolean;
}

export interface RemoveMentionQueryTextParams {
	editorAPI: EditorAPI;
}

export interface HandleMentionInsertionParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}
