import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { RichTextEditorUI, TemplateVariableKind } from "#ui";

export interface CreateTemplateVariableComponentParams {
	type: TemplateVariableKind;
	displayText: string;
}

export interface CreateTemplateVariableComponentResult
	extends InlineNestedContext {}

export interface HandleTemplateVariableInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
