import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleAudioDeleteParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
