import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaConfigPort } from "#adapters";

export interface ConfigureEmptyMediaParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}
