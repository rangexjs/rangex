import type { EditorAPI } from "rich-text-area";
import type { CommandMenuEditorPort } from "#adapters";

export interface HandlePopoverAppearanceParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}
