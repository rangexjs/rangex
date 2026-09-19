import type { EditorAPI } from "rich-text-area";
import type { MarkdownConfigPort } from "#adapters/Markdown";

export interface ConfigureMarkdownParams {
	configPort: MarkdownConfigPort;
	editorAPI: EditorAPI;
}
