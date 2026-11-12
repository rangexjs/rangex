import type { EditorAPI } from "@rangex/core";

import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleFindReplaceActivationParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
