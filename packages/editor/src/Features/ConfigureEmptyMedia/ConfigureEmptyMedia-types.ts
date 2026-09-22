import type { EditorAPI } from "rich-text-area";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";

export interface ConfigureEmptyMediaParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}
