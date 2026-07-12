import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateVideoComponentParams {
	src: string;
	title: string;
}

export interface CreateVideoComponentResult extends BlockNestedContextLine {}

export interface InsertVideosParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	videoLines: CreateVideoComponentResult[];
}

export interface InsertVideoFromURLParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	url: string;
	title: string;
}

export interface InsertVideosFromFilesParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	files: FileList;
	title: string;
}

export interface HandleVideoInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
