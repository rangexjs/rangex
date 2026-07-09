import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateImageComponentParams {
	src: string;
}

export interface CreateImageComponentResult extends BlockNestedContextLine {}

export interface InsertImagesParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	imageLines: CreateImageComponentResult[];
}

export interface InsertImageFromURLParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	url: string;
}

export interface InsertImagesFromFilesParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	files: FileList;
}

export interface HandleImageInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
