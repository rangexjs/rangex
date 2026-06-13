import type {
	RichTextEditorUI,
	TableQuickActionsPopover,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI, Table, TableCell } from "rich-text-area";

export interface GetActiveTableParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableResult = Table | null;

export interface HandleSelectionTypeParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleMergeSplitParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleInsertDeleteParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleCellTypeParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface GetActiveTableCellsParams {
	editorAPI: EditorAPI;
}

export type GetActiveTableCellsResult = TableCell[];

export interface HandleVerticalAlignmentParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleCellResizingParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleClearContentsParams {
	tableQuickActionsPopover: TableQuickActionsPopover;
	editorAPI: EditorAPI;
}

export interface HandleTableQuickActionsButtonsInteractionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
