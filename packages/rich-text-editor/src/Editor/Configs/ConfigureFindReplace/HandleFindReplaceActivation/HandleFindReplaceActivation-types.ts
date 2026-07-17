import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleFindReplaceActivationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
