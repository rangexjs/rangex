import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";

export interface RemoveMentionQueryTextResult {
	queryFound: boolean;
}

export interface RemoveMentionQueryTextParams {
	editorAPI: EditorAPI;
}

export interface CreateMentionComponentParams {
	userId: string;
	name: string;
}

export interface CreateMentionComponentResult extends InlineNestedContext {}

export interface HandleMentionInsertionParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}
