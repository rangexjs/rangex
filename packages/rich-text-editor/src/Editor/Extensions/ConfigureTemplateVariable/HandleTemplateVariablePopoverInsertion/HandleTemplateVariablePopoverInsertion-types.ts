import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type {
	TemplateVariableEditorPort,
	TemplateVariableKind,
} from "#adapters";

export interface RemoveTemplateVariableQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveTemplateVariableQueryTextResult {
	queryFound: boolean;
}

export interface CreateTemplateVariableComponentParams {
	type: TemplateVariableKind;
	displayText: string;
}

export interface CreateTemplateVariableComponentResult
	extends InlineNestedContext {}

export interface HandleTemplateVariablePopoverInsertionParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
