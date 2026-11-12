import type { EditorAPI } from "@rangex/core";

import type { TemplateVariableConfigPort } from "#adapters/TemplateVariable";

export interface HandleTemplateVariablePlacementStateParams {
	configPort: TemplateVariableConfigPort;
	editorAPI: EditorAPI;
}
