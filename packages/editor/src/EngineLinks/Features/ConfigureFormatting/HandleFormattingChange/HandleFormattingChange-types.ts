import type { EditorAPI } from "rich-text-area";
import type { FormattingConfigPort } from "#adapters";

export interface HandleFormattingChangeParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
