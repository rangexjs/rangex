import type { CreateAdapterConstructor } from "#ports";
import type { EditorOverlayMount, UIOverlayMount } from "../_Utilities";

export type TableAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface TableToolbarButtonState {
	disabled: boolean;
}

export interface TableQuickActionsButtonState {
	disabled: boolean;
	checked?: boolean;
	info?: string;
}

export interface TableSectionTypeState {
	header: TableQuickActionsButtonState;
	body: TableQuickActionsButtonState;
	footer: TableQuickActionsButtonState;
}

export interface TableMergeSplitState {
	mergeSelected: TableQuickActionsButtonState;
	mergeUp: TableQuickActionsButtonState;
	mergeDown: TableQuickActionsButtonState;
	mergeLeft: TableQuickActionsButtonState;
	mergeRight: TableQuickActionsButtonState;
	splitHorizontally: TableQuickActionsButtonState;
	splitVertically: TableQuickActionsButtonState;
	splitFully: TableQuickActionsButtonState;
}

export interface TableInsertDeleteState {
	insertRowAbove: TableQuickActionsButtonState;
	insertRowBelow: TableQuickActionsButtonState;
	insertColumnLeft: TableQuickActionsButtonState;
	insertColumnRight: TableQuickActionsButtonState;
	deleteRow: TableQuickActionsButtonState;
	deleteColumn: TableQuickActionsButtonState;
}

export interface TableCellTypeState {
	header: TableQuickActionsButtonState;
	data: TableQuickActionsButtonState;
}

export interface TableVerticalAlignmentState {
	top: TableQuickActionsButtonState;
	middle: TableQuickActionsButtonState;
	bottom: TableQuickActionsButtonState;
}

export interface TableCellResizingState {
	equalizeColumns: TableQuickActionsButtonState;
	minimizeRows: TableQuickActionsButtonState;
}

export interface TableClearContentsState extends TableQuickActionsButtonState {}

export type TableSectionTypeAction = "header" | "body" | "footer";
export type TableMergeSplitAction =
	| "mergeSelected"
	| "mergeUp"
	| "mergeDown"
	| "mergeLeft"
	| "mergeRight"
	| "splitHorizontally"
	| "splitVertically"
	| "splitFully";
export type TableInsertDeleteAction =
	| "insertRowAbove"
	| "insertRowBelow"
	| "insertColumnLeft"
	| "insertColumnRight"
	| "deleteRow"
	| "deleteColumn";
export type TableCellTypeAction = "header" | "data";
export type TableVerticalAlignmentAction = "top" | "middle" | "bottom";
export type TableCellResizingAction = "equalizeColumns" | "minimizeRows";

export interface TableState {
	toolbarButton?: TableToolbarButtonState;
	sectionType?: TableSectionTypeState;
	mergeSplit?: TableMergeSplitState;
	insertDelete?: TableInsertDeleteState;
	cellType?: TableCellTypeState;
	verticalAlignment?: TableVerticalAlignmentState;
	cellResizing?: TableCellResizingState;
	clearContents?: TableClearContentsState;
}

export interface UpdateTableStateParams extends TableState {}

export interface TableInsertRequestParams {
	row: number;
	column: number;
}

export type TableUpdateToolbarButtonFn = (
	value: TableToolbarButtonState,
) => void;
export type TableUpdateSectionTypeFn = (value: TableSectionTypeState) => void;
export type TableUpdateMergeSplitFn = (value: TableMergeSplitState) => void;
export type TableUpdateInsertDeleteFn = (value: TableInsertDeleteState) => void;
export type TableUpdateCellTypeFn = (value: TableCellTypeState) => void;
export type TableUpdateVerticalAlignmentFn = (
	value: TableVerticalAlignmentState,
) => void;
export type TableUpdateCellResizingFn = (value: TableCellResizingState) => void;
export type TableUpdateClearContentsFn = (
	value: TableClearContentsState,
) => void;

export interface TableUIPort {
	readonly popover: UIOverlayMount;
	readonly toolbarButton: TableToolbarButtonState;
	readonly sectionType: TableSectionTypeState;
	readonly mergeSplit: TableMergeSplitState;
	readonly insertDelete: TableInsertDeleteState;
	readonly cellType: TableCellTypeState;
	readonly verticalAlignment: TableVerticalAlignmentState;
	readonly cellResizing: TableCellResizingState;
	readonly clearContents: TableClearContentsState;
	onToolbarButtonUpdate(callback: TableUpdateToolbarButtonFn): () => void;
	onSectionTypeUpdate(callback: TableUpdateSectionTypeFn): () => void;
	onMergeSplitUpdate(callback: TableUpdateMergeSplitFn): () => void;
	onInsertDeleteUpdate(callback: TableUpdateInsertDeleteFn): () => void;
	onCellTypeUpdate(callback: TableUpdateCellTypeFn): () => void;
	onVerticalAlignmentUpdate(
		callback: TableUpdateVerticalAlignmentFn,
	): () => void;
	onCellResizingUpdate(callback: TableUpdateCellResizingFn): () => void;
	onClearContentsUpdate(callback: TableUpdateClearContentsFn): () => void;
	emitInsertRequest(params: TableInsertRequestParams): void;
	emitSectionType(action: TableSectionTypeAction): void;
	emitMergeSplit(action: TableMergeSplitAction): void;
	emitInsertDelete(action: TableInsertDeleteAction): void;
	emitCellType(action: TableCellTypeAction): void;
	emitVerticalAlignment(action: TableVerticalAlignmentAction): void;
	emitCellResizing(action: TableCellResizingAction): void;
	emitClearContents(): void;
}

export type TableOnInsertRequestFn = (params: TableInsertRequestParams) => void;
export type TableOnSectionTypeFn = (action: TableSectionTypeAction) => void;
export type TableOnMergeSplitFn = (action: TableMergeSplitAction) => void;
export type TableOnInsertDeleteFn = (action: TableInsertDeleteAction) => void;
export type TableOnCellTypeFn = (action: TableCellTypeAction) => void;
export type TableOnVerticalAlignmentFn = (
	action: TableVerticalAlignmentAction,
) => void;
export type TableOnCellResizingFn = (action: TableCellResizingAction) => void;
export type TableOnClearContentsFn = () => void;

export interface TableEditorPort {
	readonly popover: EditorOverlayMount;
	updateState(params: UpdateTableStateParams): void;
	onInsertRequest(callback: TableOnInsertRequestFn): () => void;
	onSectionType(callback: TableOnSectionTypeFn): () => void;
	onMergeSplit(callback: TableOnMergeSplitFn): () => void;
	onInsertDelete(callback: TableOnInsertDeleteFn): () => void;
	onCellType(callback: TableOnCellTypeFn): () => void;
	onVerticalAlignment(callback: TableOnVerticalAlignmentFn): () => void;
	onCellResizing(callback: TableOnCellResizingFn): () => void;
	onClearContents(callback: TableOnClearContentsFn): () => void;
}
