import type { EditorAPI } from "rich-text-area";
import type { TemplateVariablePort } from "#ports";

export interface HandleTemplateVariablePopoverAppearanceParams {
	templateVariablePort: TemplateVariablePort;
	editorAPI: EditorAPI;
}
