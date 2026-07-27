import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";

export interface HandleTemplateVariablePopoverAppearanceParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
