import type { EditorAPI } from "rich-text-area";
import type { EmbedConfigPort } from "#adapters/Embed";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleEmbedInsertionParams {
	configPort: EmbedConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
