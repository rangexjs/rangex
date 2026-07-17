import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface SetupInitialStatesParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface HandleNonCategorizedOperationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
