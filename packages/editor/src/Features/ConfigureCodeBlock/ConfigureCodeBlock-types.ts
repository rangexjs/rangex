import type { EditorAPI } from "rich-text-area";
import type { CodeBlockConfigPort } from "#adapters/CodeBlock";

export interface ConfigureCodeBlockParams {
	configPort: CodeBlockConfigPort;
	editorAPI: EditorAPI;
}
