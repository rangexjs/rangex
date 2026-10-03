import type { BlockComponent } from "@rangex/core";
import type {
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

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
	sectionType?: TableSectionTypeState;
	mergeSplit?: TableMergeSplitState;
	insertDelete?: TableInsertDeleteState;
	cellType?: TableCellTypeState;
	verticalAlignment?: TableVerticalAlignmentState;
	cellResizing?: TableCellResizingState;
	clearContents?: TableClearContentsState;
	contextMenuOpen?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
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
export type OnContextMenuToggleCallbackFn = () => void;

export interface InsertParams {
	row: number;
	column: number;
}

export type OnInsertCallbackFn = (params: InsertParams) => void;

export type OnChangeSectionTypeCallbackFn = (
	action: TableSectionTypeAction,
) => void;
export type OnChangeMergeSplitCallbackFn = (
	action: TableMergeSplitAction,
) => void;
export type OnChangeInsertDeleteCallbackFn = (
	action: TableInsertDeleteAction,
) => void;
export type OnChangeCellTypeCallbackFn = (action: TableCellTypeAction) => void;
export type OnChangeVerticalAlignmentCallbackFn = (
	action: TableVerticalAlignmentAction,
) => void;
export type OnChangeCellResizingCallbackFn = (
	action: TableCellResizingAction,
) => void;
export type OnClearContentsCallbackFn = () => void;

export interface UpdateStateParams extends TableState {}

export interface TableConfigPortProps {
	readonly contextMenuEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;
	setContextMenu(params: { open: boolean }): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onChangeSectionType(callback: OnChangeSectionTypeCallbackFn): () => void;
	onChangeMergeSplit(callback: OnChangeMergeSplitCallbackFn): () => void;
	onChangeInsertDelete(callback: OnChangeInsertDeleteCallbackFn): () => void;
	onChangeCellType(callback: OnChangeCellTypeCallbackFn): () => void;
	onChangeVerticalAlignment(
		callback: OnChangeVerticalAlignmentCallbackFn,
	): () => void;
	onChangeCellResizing(callback: OnChangeCellResizingCallbackFn): () => void;
	onClear(callback: OnClearContentsCallbackFn): () => void;
}

export interface TableConfigPort
	extends TableConfigPortProps,
		UnwrapConfigPort,
		CurrentComponentConfigPort<BlockComponent> {}

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
	onSectionTypeUpdate(callback: OnSectionTypeUpdateCallbackFn): () => void;
	onMergeSplitUpdate(callback: OnMergeSplitUpdateCallbackFn): () => void;
	onInsertDeleteUpdate(callback: OnInsertDeleteUpdateCallbackFn): () => void;
	onCellTypeUpdate(callback: OnCellTypeUpdateCallbackFn): () => void;
	onVerticalAlignmentUpdate(
		callback: OnVerticalAlignmentUpdateCallbackFn,
	): () => void;
	onCellResizingUpdate(callback: OnCellResizingUpdateCallbackFn): () => void;
	onClearContentsUpdate(callback: OnClearContentsUpdateCallbackFn): () => void;
	onContextMenuToggle(callback: OnContextMenuToggleCallbackFn): () => void;

	insert(params: InsertParams): void;
	changeSectionType(action: TableSectionTypeAction): void;
	changeMergeSplit(action: TableMergeSplitAction): void;
	changeInsertDelete(action: TableInsertDeleteAction): void;
	changeCellType(action: TableCellTypeAction): void;
	changeVerticalAlignment(action: TableVerticalAlignmentAction): void;
	changeCellResizing(action: TableCellResizingAction): void;
	clear(): void;
}

export interface TablePublicPort
	extends TablePublicPortProps,
		UnwrapPublicPort,
		CurrentComponentPublicPort {}

export interface TableInternals {
	contextMenuOpen: boolean;
}

export interface TableAdapter {
	configPort: TableConfigPort;
	publicPort: TablePublicPort;
}

export interface TableSettings {}

export interface CreateTableAdapterParams
	extends CreateAdapterParams<TableSettings> {}

export interface CreateTableAdapterResult extends TableAdapter {}
