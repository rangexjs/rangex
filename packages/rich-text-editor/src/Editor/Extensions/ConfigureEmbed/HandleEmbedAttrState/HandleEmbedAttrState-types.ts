import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";

export interface HandleEmbedAttrStateParams {
	editorPort: EmbedEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
