import type { EditorAPI } from "@rangex/core";

import type { ImageConfigPort } from "#adapters/Image";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleImageInsertionParams {
	configPort: ImageConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
