import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { TemplateVariableKind, TemplateVariablePort } from "#ports";

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
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}
