import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

export interface HandleFindReplaceActivationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
