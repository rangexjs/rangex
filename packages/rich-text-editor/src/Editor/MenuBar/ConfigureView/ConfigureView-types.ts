import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureThemeParams {
	richTextEditorUI: RichTextEditorUI;
}

export interface ConfigureViewParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
