import type { EditorAPI } from "rich-text-area";
import type { SeparatorConfigPort } from "#adapters/Separator";

export interface ConfigureSeparatorParams {
	configPort: SeparatorConfigPort;
	editorAPI: EditorAPI;
}
