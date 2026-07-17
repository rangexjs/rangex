import type { EditorAPI, Table, TableCell } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface GetActiveTableCellsParams {
	editorAPI: EditorAPI;
	table: Table;
}

export type GetActiveTableCellsResult = TableCell[];

export interface CellTypeState {
	header: boolean;
	data: boolean;
}

export interface GetCellTypeButtonsStateParams {
	editorAPI: EditorAPI;
	table: Table;
}

export interface GetCellTypeButtonsStateResult extends CellTypeState {}

export interface VerticalAlignmentState {
	top: boolean;
	middle: boolean;
	bottom: boolean;
}

export interface GetVerticalAlignmentButtonsStateParams {
	editorAPI: EditorAPI;
	table: Table;
}

export interface GetVerticalAlignmentButtonsStateResult
	extends VerticalAlignmentState {}

export interface IsTableCellEmptyParams {
	tableCell: TableCell;
}

export type IsTableCellEmptyResult = boolean;

export interface IsClearContentsDisabledParams {
	editorAPI: EditorAPI;
	table: Table;
}

export type IsClearContentsDisabledResult = boolean;

export interface UpdateTableQuickActionsButtonsStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	table: Table;
}

export interface HandleTableQuickActionsButtonsStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
