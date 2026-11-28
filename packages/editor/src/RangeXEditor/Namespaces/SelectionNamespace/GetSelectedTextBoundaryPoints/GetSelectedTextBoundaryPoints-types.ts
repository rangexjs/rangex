import type {
  ContentFlowNode,
  EditorAPI,
  NestedEditable,
  RootEditable,
  Table,
  TableCell,
} from "@rangex/core";

export interface GetActiveSelectionTableParams {
  rootEditable: RootEditable;
}

export type GetActiveSelectionTableResult = Table | null;

export interface GetTableCellEditableParams {
  tableCell: TableCell;
}

export type GetTableCellEditableResult = NestedEditable;

export interface GetSelectedTextBoundaryPointsParams {
  editorAPI: EditorAPI;
}

export interface GetSelectedTextBoundaryPointsResult {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}
