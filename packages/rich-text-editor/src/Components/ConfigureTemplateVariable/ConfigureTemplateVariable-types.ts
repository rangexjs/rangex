import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, InlineNestedContext } from "rich-text-area";

export interface CreateTemplateVariableComponentParams {
	data: unknown;
}

export interface CreateTemplateVariableComponentResult
	extends InlineNestedContext {}

export interface ConfigureTemplateVariableParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
