import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

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
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
