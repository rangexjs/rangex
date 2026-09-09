import type { EditorAPI } from "rich-text-area";
import type { ReadOnlyConfigPort } from "#adapters/ReadOnly";

export interface ConfigureReadOnlyParams {
	configPort: ReadOnlyConfigPort;
	editorAPI: EditorAPI;
}
