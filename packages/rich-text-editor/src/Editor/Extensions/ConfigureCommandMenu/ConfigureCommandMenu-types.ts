import type { EditorAPI } from "rich-text-area";
import type { CommandMenuEditorPort } from "#adapters";

export interface ConfigureCommandMenuParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}
