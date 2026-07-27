import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";

export interface HandleTemplateVariableToolbarButtonStateParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
