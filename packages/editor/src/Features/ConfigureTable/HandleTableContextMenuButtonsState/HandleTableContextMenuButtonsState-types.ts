import type { EditorAPI, Table, TableCell } from "@rangex/core";
import type { TableConfigPort } from "#adapters/Table";

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
	start: boolean;
	center: boolean;
	end: boolean;
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

export interface UpdateTableContextMenuButtonsStateParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
	table: Table;
}

export interface HandleTableContextMenuButtonsStateParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}
