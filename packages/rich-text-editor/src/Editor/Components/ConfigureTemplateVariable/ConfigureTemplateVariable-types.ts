import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureTemplateVariableParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
