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
	changeSectionType(action: TableSectionTypeAction): void;
	changeMergeSplit(action: TableMergeSplitAction): void;
	changeInsertDelete(action: TableInsertDeleteAction): void;
	changeCellType(action: TableCellTypeAction): void;
	changeVerticalAlignment(action: TableVerticalAlignmentAction): void;
	changeCellResizing(action: TableCellResizingAction): void;
	clear(): void;
}
