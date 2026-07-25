import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";

export interface HandlePopoverAppearanceParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}
