import type {
	TableCellResizingState,
	TableCellTypeState,
	TableClearContentsState,
	TableInsertDeleteState,
	TableMergeSplitState,
	TableSectionTypeState,
	TableVerticalAlignmentState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveTablePort {
	canInsert: Accessor<boolean>;
	isActive: Accessor<boolean>;
	sectionType: Accessor<TableSectionTypeState>;
	mergeSplit: Accessor<TableMergeSplitState>;
	insertDelete: Accessor<TableInsertDeleteState>;
	cellType: Accessor<TableCellTypeState>;
	verticalAlignment: Accessor<TableVerticalAlignmentState>;
	cellResizing: Accessor<TableCellResizingState>;
	clearContents: Accessor<TableClearContentsState>;
}
