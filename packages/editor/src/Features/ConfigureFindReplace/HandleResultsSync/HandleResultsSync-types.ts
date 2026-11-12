import type { EditorAPI } from "@rangex/core";

import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleResultsSyncParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
