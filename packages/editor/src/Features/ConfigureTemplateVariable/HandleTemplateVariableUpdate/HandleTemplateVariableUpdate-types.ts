import type { EditorAPI, RootEditable } from "rich-text-area";
import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";
import type { TemplateVariableValues } from "#engine-links";

export interface HandleTemplateVariableUpdateParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableValues;
}
