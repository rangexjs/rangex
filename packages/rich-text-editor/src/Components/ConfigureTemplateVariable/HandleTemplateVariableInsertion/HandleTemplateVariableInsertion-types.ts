import type {
	RichTextEditorUI,
	TemplateVariableKind,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI, InlineNestedContext } from "rich-text-area";

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
