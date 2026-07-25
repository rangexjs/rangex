import type { EditorAPI } from "rich-text-area";
import type { CodeBlockEditorPort } from "#adapters";

export interface ConfigureCodeBlockParams {
	editorPort: CodeBlockEditorPort;
	editorAPI: EditorAPI;
}
