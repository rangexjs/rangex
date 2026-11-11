import type { EditorAPI } from "@rangex/core";

import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariableUpdateParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}
