import type { EditorAPI } from "@rangex/core";

import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariableInitializationParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}
