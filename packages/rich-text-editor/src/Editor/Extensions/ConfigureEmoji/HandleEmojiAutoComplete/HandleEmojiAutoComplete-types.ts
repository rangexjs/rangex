import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";

export interface HandleEmojiAutoCompleteParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}
