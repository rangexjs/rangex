import type { EditorAPI, Table, TableCell } from "rich-text-area";
import type { TableEditorPort } from "#adapters";

export interface GetActiveTableParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableResult = Table | null;

export interface HandleSelectionTypeParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleMergeSplitParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleInsertDeleteParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleCellTypeParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface GetActiveTableCellsParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableCellsResult = TableCell[];

export interface HandleVerticalAlignmentParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleCellResizingParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleClearContentsParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonsInteractionParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}
