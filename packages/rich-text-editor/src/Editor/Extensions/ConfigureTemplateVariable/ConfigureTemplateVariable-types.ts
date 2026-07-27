import type { EditorAPI } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";

export interface ConfigureTemplateVariableParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}
