import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type {
	TemplateVariableEditorPort,
	TemplateVariableKind,
} from "#adapters";

export interface CreateTemplateVariableComponentParams {
	type: TemplateVariableKind;
	displayText: string;
}

export interface CreateTemplateVariableComponentResult
	extends InlineNestedContext {}

export interface HandleTemplateVariableInsertionParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
