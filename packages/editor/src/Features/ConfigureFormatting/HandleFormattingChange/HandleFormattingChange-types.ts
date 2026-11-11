import type { EditorAPI } from "@rangex/core";

import type { FormattingConfigPort } from "#adapters/Formatting";

export interface HandleFormattingChangeParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
