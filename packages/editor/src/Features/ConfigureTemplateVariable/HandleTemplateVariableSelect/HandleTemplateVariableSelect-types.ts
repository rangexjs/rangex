import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariableSelectParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}

export interface RemoveTemplateVariableQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveTemplateVariableQueryTextResult {
	queryFound: boolean;
}
