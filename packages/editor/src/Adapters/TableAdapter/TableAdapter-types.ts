import type { CreateAdapterParams } from "../_Utilities";

export interface TableActionButtonState {
	disabled: boolean;
	checked?: boolean;
	info?: string;
}

export interface TableSectionTypeState {
	header: TableActionButtonState;
	body: TableActionButtonState;
	footer: TableActionButtonState;
}

export interface TableMergeSplitState {
	mergeSelected: TableActionButtonState;
	mergeUp: TableActionButtonState;
	mergeDown: TableActionButtonState;
	mergeLeft: TableActionButtonState;
	mergeRight: TableActionButtonState;
	splitHorizontally: TableActionButtonState;
	splitVertically: TableActionButtonState;
	splitFully: TableActionButtonState;
}

export interface TableInsertDeleteState {
	insertRowAbove: TableActionButtonState;
	insertRowBelow: TableActionButtonState;
	insertColumnLeft: TableActionButtonState;
	insertColumnRight: TableActionButtonState;
	deleteRow: TableActionButtonState;
	deleteColumn: TableActionButtonState;
}

export interface TableCellTypeState {
	header: TableActionButtonState;
	data: TableActionButtonState;
}

export interface TableVerticalAlignmentState {
	top: TableActionButtonState;
	middle: TableActionButtonState;
	bottom: TableActionButtonState;
}

export interface TableCellResizingState {
	equalizeColumns: TableActionButtonState;
	minimizeRows: TableActionButtonState;
}

export interface TableClearContentsState extends TableActionButtonState {}

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
	canInsert?: boolean;
	contextMenuOpen?: boolean;
	sectionType?: TableSectionTypeState;
	mergeSplit?: TableMergeSplitState;
	insertDelete?: TableInsertDeleteState;
	cellType?: TableCellTypeState;
	verticalAlignment?: TableVerticalAlignmentState;
	cellResizing?: TableCellResizingState;
	clearContents?: TableClearContentsState;
}

export interface UpdateStateParams extends TableState {}

export interface InsertParams {
	row: number;
	column: number;
}

export type OnInsertCallbackFn = (params: InsertParams) => void;
export type OnSectionTypeCallbackFn = (action: TableSectionTypeAction) => void;
export type OnMergeSplitCallbackFn = (action: TableMergeSplitAction) => void;
export type OnInsertDeleteCallbackFn = (
	action: TableInsertDeleteAction,
) => void;
export type OnCellTypeCallbackFn = (action: TableCellTypeAction) => void;
export type OnVerticalAlignmentCallbackFn = (
	action: TableVerticalAlignmentAction,
) => void;
export type OnCellResizingCallbackFn = (
	action: TableCellResizingAction,
) => void;
export type OnClearContentsCallbackFn = () => void;

export interface TableConfigPortProps {
	readonly contextMenuEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;
	setContextMenu(params: { open: boolean }): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onSectionType(callback: OnSectionTypeCallbackFn): () => void;
	onMergeSplit(callback: OnMergeSplitCallbackFn): () => void;
	onInsertDelete(callback: OnInsertDeleteCallbackFn): () => void;
	onCellType(callback: OnCellTypeCallbackFn): () => void;
	onVerticalAlignment(callback: OnVerticalAlignmentCallbackFn): () => void;
	onCellResizing(callback: OnCellResizingCallbackFn): () => void;
	onClear(callback: OnClearContentsCallbackFn): () => void;
}

export interface TableConfigPort extends TableConfigPortProps {}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnContextMenuOpenUpdateCallbackFn = (
	contextMenuOpen: boolean,
) => void;
export type OnSectionTypeUpdateCallbackFn = (
	value: TableSectionTypeState,
) => void;
export type OnMergeSplitUpdateCallbackFn = (
	value: TableMergeSplitState,
) => void;
export type OnInsertDeleteUpdateCallbackFn = (
	value: TableInsertDeleteState,
) => void;
export type OnCellTypeUpdateCallbackFn = (value: TableCellTypeState) => void;
export type OnVerticalAlignmentUpdateCallbackFn = (
	value: TableVerticalAlignmentState,
) => void;
export type OnCellResizingUpdateCallbackFn = (
	value: TableCellResizingState,
) => void;
export type OnClearContentsUpdateCallbackFn = (
	value: TableClearContentsState,
) => void;

export interface TablePublicPortProps {
	readonly contextMenuEl: HTMLDivElement;

	readonly canInsert: boolean;
	readonly contextMenuOpen: boolean;
	readonly sectionType: TableSectionTypeState;
	readonly mergeSplit: TableMergeSplitState;
	readonly insertDelete: TableInsertDeleteState;
	readonly cellType: TableCellTypeState;
	readonly verticalAlignment: TableVerticalAlignmentState;
	readonly cellResizing: TableCellResizingState;
	readonly clearContents: TableClearContentsState;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onContextMenuOpenUpdate(
		callback: OnContextMenuOpenUpdateCallbackFn,
	): () => void;
	onSectionTypeUpdate(callback: OnSectionTypeUpdateCallbackFn): () => void;
	onMergeSplitUpdate(callback: OnMergeSplitUpdateCallbackFn): () => void;
	onInsertDeleteUpdate(callback: OnInsertDeleteUpdateCallbackFn): () => void;
	onCellTypeUpdate(callback: OnCellTypeUpdateCallbackFn): () => void;
	onVerticalAlignmentUpdate(
		callback: OnVerticalAlignmentUpdateCallbackFn,
	): () => void;
	onCellResizingUpdate(callback: OnCellResizingUpdateCallbackFn): () => void;
	onClearContentsUpdate(callback: OnClearContentsUpdateCallbackFn): () => void;

	insert(params: InsertParams): void;
	setSectionType(action: TableSectionTypeAction): void;
	setMergeSplit(action: TableMergeSplitAction): void;
	setInsertDelete(action: TableInsertDeleteAction): void;
	setCellType(action: TableCellTypeAction): void;
	setVerticalAlignment(action: TableVerticalAlignmentAction): void;
	setCellResizing(action: TableCellResizingAction): void;
	clear(): void;
}

export interface TablePublicPort extends TablePublicPortProps {}

export interface TableInternals {
	canInsert: boolean;
	contextMenuOpen: boolean;
	sectionType: TableSectionTypeState;
	mergeSplit: TableMergeSplitState;
	insertDelete: TableInsertDeleteState;
	cellType: TableCellTypeState;
	verticalAlignment: TableVerticalAlignmentState;
	cellResizing: TableCellResizingState;
	clearContents: TableClearContentsState;
}

export interface TableAdapter {
	configPort: TableConfigPort;
	publicPort: TablePublicPort;
}

export interface TableSettings {}

export interface CreateTableAdapterParams
	extends CreateAdapterParams<TableSettings> {}

export interface CreateTableAdapterResult extends TableAdapter {}
