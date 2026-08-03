import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";

export interface HandleTemplateVariableInsertionParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
