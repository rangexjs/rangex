import type { EditorAPI } from "@rangex/core";

import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleNavigateToIndexParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
