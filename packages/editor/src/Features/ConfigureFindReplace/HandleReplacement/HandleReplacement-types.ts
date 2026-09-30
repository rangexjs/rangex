import type { EditorAPI } from "@rangex/core";
import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleReplacementParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
