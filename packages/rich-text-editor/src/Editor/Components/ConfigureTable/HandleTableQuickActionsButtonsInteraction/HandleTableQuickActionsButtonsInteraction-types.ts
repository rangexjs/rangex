import type { EditorAPI, Table, TableCell } from "rich-text-area";
import type { TableQuickActionsPort } from "#ports";
import type { RichTextEditorUI } from "#ui";

export interface GetActiveTableParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableResult = Table | null;

export interface HandleSelectionTypeParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleMergeSplitParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleInsertDeleteParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleCellTypeParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface GetActiveTableCellsParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableCellsResult = TableCell[];

export interface HandleVerticalAlignmentParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleCellResizingParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleClearContentsParams {
	tableQuickActionsPort: TableQuickActionsPort;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonsInteractionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
