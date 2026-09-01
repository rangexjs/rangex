import type { EditorAPI } from "rich-text-area";
import type { FormattingConfigPort } from "#adapters";

export interface HandleFormattingButtonStateParams {
	configPort: FormattingConfigPort;
	editorAPI: EditorAPI;
}
