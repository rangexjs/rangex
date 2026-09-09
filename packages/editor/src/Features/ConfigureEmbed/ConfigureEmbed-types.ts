import type { EditorAPI } from "rich-text-area";
import type { EmbedConfigPort } from "#adapters/Embed";

export interface ConfigureEmbedParams {
	configPort: EmbedConfigPort;
	editorAPI: EditorAPI;
}
