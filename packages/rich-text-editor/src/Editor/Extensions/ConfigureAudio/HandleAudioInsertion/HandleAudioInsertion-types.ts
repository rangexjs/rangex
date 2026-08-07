import type { EditorAPI } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleAudioInsertionParams {
	editorPort: AudioEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
