import type { EditorAPI } from "rich-text-area";
import type { ImageConfigPort } from "#adapters/Image";

export interface ConfigureImageParams {
	configPort: ImageConfigPort;
	editorAPI: EditorAPI;
}
