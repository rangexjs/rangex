import type { EditorAPI } from "@rangex/core";

import type { EmbedConfigPort } from "#adapters/Embed";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleEmbedInsertionParams {
	configPort: EmbedConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
