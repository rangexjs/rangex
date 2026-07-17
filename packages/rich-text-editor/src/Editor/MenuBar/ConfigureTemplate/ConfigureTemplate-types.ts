import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureTemplateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
