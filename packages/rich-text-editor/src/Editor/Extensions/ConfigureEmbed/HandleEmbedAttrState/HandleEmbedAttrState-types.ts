import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { EmbedEditorPort } from "#adapters";

export interface HandleEmbedAttrStateParams {
	editorPort: EmbedEditorPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
