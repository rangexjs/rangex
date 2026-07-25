import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";

export interface ConfigureEmojiParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}
