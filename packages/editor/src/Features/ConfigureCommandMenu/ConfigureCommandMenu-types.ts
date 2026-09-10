import type { EditorAPI } from "rich-text-area";
import type { CommandMenuConfigPort } from "#adapters/CommandMenu";

export interface ConfigureCommandMenuParams {
	configPort: CommandMenuConfigPort;
	editorAPI: EditorAPI;
}
