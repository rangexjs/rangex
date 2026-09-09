import type { EditorAPI } from "rich-text-area";
import type { VideoConfigPort } from "#adapters/Video";

export interface ConfigureVideoParams {
	configPort: VideoConfigPort;
	editorAPI: EditorAPI;
}
