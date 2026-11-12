import type { EditorAPI } from "@rangex/core";

import type { FormattingConfigPort } from "#adapters/Formatting";

export interface HandleFormattingButtonStateParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
