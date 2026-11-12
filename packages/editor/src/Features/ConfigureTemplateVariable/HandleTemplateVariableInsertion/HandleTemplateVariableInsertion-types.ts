import type { EditorAPI } from "@rangex/core";

import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariableInsertionParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}
