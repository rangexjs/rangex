import type { EditorAPI } from "rich-text-area";
import type { AudioEditorPort } from "#adapters";

export interface HandleAudioInsertionParams {
	editorPort: AudioEditorPort;
	editorAPI: EditorAPI;
}
