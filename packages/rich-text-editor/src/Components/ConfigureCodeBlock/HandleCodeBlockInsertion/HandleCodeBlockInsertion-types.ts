import type {
	CodeBlockLanguage,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateCodeBlockLineParams {
	language: CodeBlockLanguage;
}

export interface CreateCodeBlockLineResult extends BlockNestedContextLine {}

export interface HandleCodeBlockInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
