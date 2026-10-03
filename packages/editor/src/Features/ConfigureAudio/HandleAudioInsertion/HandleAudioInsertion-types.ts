import type { EditorAPI } from "@rangex/core";
import type { AudioConfigPort } from "#adapters/Audio";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleAudioInsertionParams {
	configPort: AudioConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
