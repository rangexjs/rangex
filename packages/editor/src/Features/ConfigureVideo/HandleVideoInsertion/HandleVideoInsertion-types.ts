import type { EditorAPI } from "@rangex/core";
import type { VideoConfigPort } from "#adapters/Video";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleVideoInsertionParams {
	configPort: VideoConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
