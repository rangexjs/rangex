import type { EditorAPI } from "rich-text-area";
import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleNavigateToIndexParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
