export interface TableQuickActionsButtonState {
	disabled: boolean;
	checked?: boolean;
	info?: string;
}

export interface TableQuickActionsSectionTypeState {
	header: TableQuickActionsButtonState;
	body: TableQuickActionsButtonState;
	footer: TableQuickActionsButtonState;
}

export interface TableQuickActionsMergeSplitState {
	mergeSelected: TableQuickActionsButtonState;
	mergeUp: TableQuickActionsButtonState;
	mergeDown: TableQuickActionsButtonState;
	mergeLeft: TableQuickActionsButtonState;
	mergeRight: TableQuickActionsButtonState;
	splitHorizontally: TableQuickActionsButtonState;
	splitVertically: TableQuickActionsButtonState;
	splitFully: TableQuickActionsButtonState;
}

export interface TableQuickActionsInsertDeleteState {
	insertRowAbove: TableQuickActionsButtonState;
	insertRowBelow: TableQuickActionsButtonState;
	insertColumnLeft: TableQuickActionsButtonState;
	insertColumnRight: TableQuickActionsButtonState;
	deleteRow: TableQuickActionsButtonState;
	deleteColumn: TableQuickActionsButtonState;
}

export interface TableQuickActionsCellTypeState {
	header: TableQuickActionsButtonState;
	data: TableQuickActionsButtonState;
}

export interface TableQuickActionsVerticalAlignmentState {
	top: TableQuickActionsButtonState;
	middle: TableQuickActionsButtonState;
	bottom: TableQuickActionsButtonState;
}

export interface TableQuickActionsCellResizingState {
	equalizeColumns: TableQuickActionsButtonState;
	minimizeRows: TableQuickActionsButtonState;
}

export interface TableQuickActionsClearContentsState
	extends TableQuickActionsButtonState {}

export type TableQuickActionsUpdateSectionTypeFn = (
	value: TableQuickActionsSectionTypeState,
) => void;
export type TableQuickActionsUpdateMergeSplitFn = (
	value: TableQuickActionsMergeSplitState,
) => void;
export type TableQuickActionsUpdateInsertDeleteFn = (
	value: TableQuickActionsInsertDeleteState,
) => void;
export type TableQuickActionsUpdateCellTypeFn = (
	value: TableQuickActionsCellTypeState,
) => void;
export type TableQuickActionsUpdateVerticalAlignmentFn = (
	value: TableQuickActionsVerticalAlignmentState,
) => void;
export type TableQuickActionsUpdateCellResizingFn = (
	value: TableQuickActionsCellResizingState,
) => void;
export type TableQuickActionsUpdateClearContentsFn = (
	value: TableQuickActionsClearContentsState,
) => void;

export interface TableQuickActionsPopoverState {
	sectionType?: TableQuickActionsSectionTypeState;
	mergeSplit?: TableQuickActionsMergeSplitState;
	insertDelete?: TableQuickActionsInsertDeleteState;
	cellType?: TableQuickActionsCellTypeState;
	verticalAlignment?: TableQuickActionsVerticalAlignmentState;
	cellResizing?: TableQuickActionsCellResizingState;
	clearContents?: TableQuickActionsClearContentsState;
}

export interface UpdateTableQuickActionsStateParams
	extends TableQuickActionsPopoverState {}

export type TableQuickActionsListenerOption =
	| { type: "sectionType"; callback: TableQuickActionsUpdateSectionTypeFn }
	| { type: "mergeSplit"; callback: TableQuickActionsUpdateMergeSplitFn }
	| { type: "insertDelete"; callback: TableQuickActionsUpdateInsertDeleteFn }
	| { type: "cellType"; callback: TableQuickActionsUpdateCellTypeFn }
	| {
			type: "verticalAlignment";
			callback: TableQuickActionsUpdateVerticalAlignmentFn;
	  }
	| { type: "cellResizing"; callback: TableQuickActionsUpdateCellResizingFn }
	| { type: "clearContents"; callback: TableQuickActionsUpdateClearContentsFn };

export type TableQuickActionsUpdateListenerParams =
	TableQuickActionsListenerOption & {
		operation: "add" | "delete";
	};

export type TableQuickActionsSectionTypeAction = "header" | "body" | "footer";
export type TableQuickActionsMergeSplitAction =
	| "mergeSelected"
	| "mergeUp"
	| "mergeDown"
	| "mergeLeft"
	| "mergeRight"
	| "splitHorizontally"
	| "splitVertically"
	| "splitFully";
export type TableQuickActionsInsertDeleteAction =
	| "insertRowAbove"
	| "insertRowBelow"
	| "insertColumnLeft"
	| "insertColumnRight"
	| "deleteRow"
	| "deleteColumn";
export type TableQuickActionsCellTypeAction = "header" | "data";
export type TableQuickActionsVerticalAlignmentAction =
	| "top"
	| "middle"
	| "bottom";
export type TableQuickActionsCellResizingAction =
	| "equalizeColumns"
	| "minimizeRows";

export type TableQuickActionsOnSectionTypeFn = (
	action: TableQuickActionsSectionTypeAction,
) => void;
export type TableQuickActionsOnMergeSplitFn = (
	action: TableQuickActionsMergeSplitAction,
) => void;
export type TableQuickActionsOnInsertDeleteFn = (
	action: TableQuickActionsInsertDeleteAction,
) => void;
export type TableQuickActionsOnCellTypeFn = (
	action: TableQuickActionsCellTypeAction,
) => void;
export type TableQuickActionsOnVerticalAlignmentFn = (
	action: TableQuickActionsVerticalAlignmentAction,
) => void;
export type TableQuickActionsOnCellResizingFn = (
	action: TableQuickActionsCellResizingAction,
) => void;
export type TableQuickActionsOnClearContentsFn = () => void;

export interface TableQuickActionsPopover {
	popover: HTMLDivElement;
	updateState(params: UpdateTableQuickActionsStateParams): void;
	onSectionType(callback: TableQuickActionsOnSectionTypeFn): () => void;
	onMergeSplit(callback: TableQuickActionsOnMergeSplitFn): () => void;
	onInsertDelete(callback: TableQuickActionsOnInsertDeleteFn): () => void;
	onCellType(callback: TableQuickActionsOnCellTypeFn): () => void;
	onVerticalAlignment(
		callback: TableQuickActionsOnVerticalAlignmentFn,
	): () => void;
	onCellResizing(callback: TableQuickActionsOnCellResizingFn): () => void;
	onClearContents(callback: TableQuickActionsOnClearContentsFn): () => void;
}
