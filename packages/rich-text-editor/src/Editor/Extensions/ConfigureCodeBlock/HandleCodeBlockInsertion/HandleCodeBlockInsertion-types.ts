import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { CodeBlockEditorPort, CodeBlockLanguage } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateCodeBlockLineParams {
	language: CodeBlockLanguage;
}

export interface CreateCodeBlockLineResult extends BlockNestedContextLine {}

export interface HandleCodeBlockInsertionParams {
	editorPort: CodeBlockEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
