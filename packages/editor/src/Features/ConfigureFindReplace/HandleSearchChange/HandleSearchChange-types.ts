import type { EditorAPI } from "@rangex/core";

import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleSearchChangeParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
