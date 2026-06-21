import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../BlockComponentPlacement";

export interface CodeBlockInternals {
	currentCodeBlock: BlockNestedContext | null;
}

export interface ConfigureCodeBlockParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
