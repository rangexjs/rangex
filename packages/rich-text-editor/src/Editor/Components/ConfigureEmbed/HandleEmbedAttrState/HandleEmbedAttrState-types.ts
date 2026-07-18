import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { EmbedPort } from "#ports";

export interface HandleEmbedAttrStateParams {
	embedPort: EmbedPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
