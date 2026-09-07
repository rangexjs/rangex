import type { EditorAPI } from "rich-text-area";
import type { FormattingConfigPort } from "#adapters/Formatting";

export interface HandleFormattingChangeParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
