import type {
	TableQuickActionsCellResizingState,
	TableQuickActionsCellTypeState,
	TableQuickActionsClearContentsState,
	TableQuickActionsInsertDeleteState,
	TableQuickActionsMergeSplitState,
	TableQuickActionsSectionTypeState,
	TableQuickActionsVerticalAlignmentState,
} from "#ports";

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
