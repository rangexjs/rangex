import type { EditorAPI, Table } from "@rangex/core";
import type { TableConfigPort } from "#adapters/Table";

export interface GetActiveTableParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableResult = Table | null;

export interface HandleSelectionTypeParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleMergeSplitParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleInsertDeleteParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleCellTypeParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleVerticalAlignmentParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleCellResizingParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleClearContentsParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}

export interface HandleTableContextMenuButtonsInteractionParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}
