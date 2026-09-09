import type { EditorAPI } from "rich-text-area";
import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface ConfigureFindReplaceParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
