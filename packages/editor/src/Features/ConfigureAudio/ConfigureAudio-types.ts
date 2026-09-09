import type { EditorAPI } from "rich-text-area";
import type { AudioConfigPort } from "#adapters/Audio";

export interface ConfigureAudioParams {
	configPort: AudioConfigPort;
	editorAPI: EditorAPI;
}
