import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariableUpdateParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}
