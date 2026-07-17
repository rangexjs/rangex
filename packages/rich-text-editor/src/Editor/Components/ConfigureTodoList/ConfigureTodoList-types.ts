import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";

export interface ConfigureTodoListParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
