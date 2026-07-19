import type { EditorAPI } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";

export interface HandlePopoverAppearanceParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}
