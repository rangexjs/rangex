import type { EditorAPI } from "rich-text-area";
import type { TemplateVariablePort } from "#ports";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureTemplateVariableParams {
	templateVariablePort: TemplateVariablePort;
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
