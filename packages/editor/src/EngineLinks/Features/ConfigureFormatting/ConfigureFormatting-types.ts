import type { EditorAPI } from "rich-text-area";
import type { FormattingConfigPort } from "#adapters";

export interface ConfigureFormattingParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
