import type { EditorAPI } from "@rangex/core";

import type { FindReplaceConfigPort } from "#adapters/FindReplace";

export interface HandleStepChangeParams {
	configPort: FindReplaceConfigPort;
	editorAPI: EditorAPI;
}
