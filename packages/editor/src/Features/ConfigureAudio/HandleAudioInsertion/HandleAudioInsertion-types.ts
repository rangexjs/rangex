import type { EditorAPI } from "rich-text-area";
import type { AudioConfigPort } from "#adapters/Audio";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleAudioInsertionParams {
	configPort: AudioConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
