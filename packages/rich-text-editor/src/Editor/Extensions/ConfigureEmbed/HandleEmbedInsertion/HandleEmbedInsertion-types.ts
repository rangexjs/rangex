import type { EditorAPI } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";

export interface HandleEmbedInsertionParams {
	editorPort: EmbedEditorPort;
	editorAPI: EditorAPI;
}
