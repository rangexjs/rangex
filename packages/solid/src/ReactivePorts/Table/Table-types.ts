import type {
	TableCellResizingAction,
	TableCellResizingState,
	TableCellTypeAction,
	TableCellTypeState,
	TableClearContentsState,
	TableInsertDeleteAction,
	TableInsertDeleteState,
	TableMergeSplitAction,
	TableMergeSplitState,
	TableSectionTypeAction,
	TableSectionTypeState,
	TableVerticalAlignmentAction,
	TableVerticalAlignmentState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface TableInsertParams {
	row: number;
	column: number;
}

export interface ReactiveTablePort {
	readonly contextMenuEl: HTMLDivElement;

	canInsert: Accessor<boolean>;
	contextMenuOpen: Accessor<boolean>;
	sectionType: Accessor<TableSectionTypeState>;
	mergeSplit: Accessor<TableMergeSplitState>;
	insertDelete: Accessor<TableInsertDeleteState>;
	cellType: Accessor<TableCellTypeState>;
	verticalAlignment: Accessor<TableVerticalAlignmentState>;
	cellResizing: Accessor<TableCellResizingState>;
	clearContents: Accessor<TableClearContentsState>;

	insert(params: TableInsertParams): void;
	setSectionType(action: TableSectionTypeAction): void;
	setMergeSplit(action: TableMergeSplitAction): void;
	setInsertDelete(action: TableInsertDeleteAction): void;
	setCellType(action: TableCellTypeAction): void;
	setVerticalAlignment(action: TableVerticalAlignmentAction): void;
	setCellResizing(action: TableCellResizingAction): void;
	clear(): void;
}

export interface ReactiveTableResult {
	port: ReactiveTablePort;
	dispose: () => void;
}
