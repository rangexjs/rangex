import type { Accessor } from "solid-js";
import type {
	TableCellResizingState,
	TableCellTypeState,
	TableClearContentsState,
	TableInsertDeleteState,
	TableMergeSplitState,
	TableSectionTypeState,
	TableUIPort,
	TableVerticalAlignmentState,
} from "#adapters";

export interface ActionItem {
	type: "button";
	label: string;
	disabled: () => boolean;
	checked: () => boolean | undefined;
	info: () => string | undefined;
	onClick: () => void;
}

export interface SubmenuItem {
	type: "submenu";
	label: string;
	items: QuickActionItem[];
}

export type QuickActionItem = ActionItem | SubmenuItem;

export interface CreateQuickActionItemsParams {
	sectionType: Accessor<TableSectionTypeState>;
	mergeSplit: Accessor<TableMergeSplitState>;
	insertDelete: Accessor<TableInsertDeleteState>;
	cellType: Accessor<TableCellTypeState>;
	verticalAlignment: Accessor<TableVerticalAlignmentState>;
	cellResizing: Accessor<TableCellResizingState>;
	clearContents: Accessor<TableClearContentsState>;
	uiPort: TableUIPort;
}

export function createQuickActionItems(
	params: CreateQuickActionItemsParams,
): QuickActionItem[] {
	const {
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
		uiPort,
	} = params;

	return [
		{
			type: "submenu",
			label: "Section type",
			items: [
				{
					type: "button",
					label: "Header",
					disabled: () => sectionType().header.disabled,
					checked: () => sectionType().header.checked,
					info: () => sectionType().header.info,
					onClick: () => uiPort.emitSectionType("header"),
				},
				{
					type: "button",
					label: "Body",
					disabled: () => sectionType().body.disabled,
					checked: () => sectionType().body.checked,
					info: () => sectionType().body.info,
					onClick: () => uiPort.emitSectionType("body"),
				},
				{
					type: "button",
					label: "Footer",
					disabled: () => sectionType().footer.disabled,
					checked: () => sectionType().footer.checked,
					info: () => sectionType().footer.info,
					onClick: () => uiPort.emitSectionType("footer"),
				},
			],
		},
		{
			type: "submenu",
			label: "Merge & Split",
			items: [
				{
					type: "button",
					label: "Merge selected",
					disabled: () => mergeSplit().mergeSelected.disabled,
					checked: () => mergeSplit().mergeSelected.checked,
					info: () => mergeSplit().mergeSelected.info,
					onClick: () => uiPort.emitMergeSplit("mergeSelected"),
				},
				{
					type: "button",
					label: "Merge up",
					disabled: () => mergeSplit().mergeUp.disabled,
					checked: () => mergeSplit().mergeUp.checked,
					info: () => mergeSplit().mergeUp.info,
					onClick: () => uiPort.emitMergeSplit("mergeUp"),
				},
				{
					type: "button",
					label: "Merge down",
					disabled: () => mergeSplit().mergeDown.disabled,
					checked: () => mergeSplit().mergeDown.checked,
					info: () => mergeSplit().mergeDown.info,
					onClick: () => uiPort.emitMergeSplit("mergeDown"),
				},
				{
					type: "button",
					label: "Merge left",
					disabled: () => mergeSplit().mergeLeft.disabled,
					checked: () => mergeSplit().mergeLeft.checked,
					info: () => mergeSplit().mergeLeft.info,
					onClick: () => uiPort.emitMergeSplit("mergeLeft"),
				},
				{
					type: "button",
					label: "Merge right",
					disabled: () => mergeSplit().mergeRight.disabled,
					checked: () => mergeSplit().mergeRight.checked,
					info: () => mergeSplit().mergeRight.info,
					onClick: () => uiPort.emitMergeSplit("mergeRight"),
				},
				{
					type: "button",
					label: "Split horizontally",
					disabled: () => mergeSplit().splitHorizontally.disabled,
					checked: () => mergeSplit().splitHorizontally.checked,
					info: () => mergeSplit().splitHorizontally.info,
					onClick: () => uiPort.emitMergeSplit("splitHorizontally"),
				},
				{
					type: "button",
					label: "Split vertically",
					disabled: () => mergeSplit().splitVertically.disabled,
					checked: () => mergeSplit().splitVertically.checked,
					info: () => mergeSplit().splitVertically.info,
					onClick: () => uiPort.emitMergeSplit("splitVertically"),
				},
				{
					type: "button",
					label: "Split fully",
					disabled: () => mergeSplit().splitFully.disabled,
					checked: () => mergeSplit().splitFully.checked,
					info: () => mergeSplit().splitFully.info,
					onClick: () => uiPort.emitMergeSplit("splitFully"),
				},
			],
		},
		{
			type: "submenu",
			label: "Insert & Delete",
			items: [
				{
					type: "button",
					label: "Insert row above",
					disabled: () => insertDelete().insertRowAbove.disabled,
					checked: () => insertDelete().insertRowAbove.checked,
					info: () => insertDelete().insertRowAbove.info,
					onClick: () => uiPort.emitInsertDelete("insertRowAbove"),
				},
				{
					type: "button",
					label: "Insert row below",
					disabled: () => insertDelete().insertRowBelow.disabled,
					checked: () => insertDelete().insertRowBelow.checked,
					info: () => insertDelete().insertRowBelow.info,
					onClick: () => uiPort.emitInsertDelete("insertRowBelow"),
				},
				{
					type: "button",
					label: "Insert column left",
					disabled: () => insertDelete().insertColumnLeft.disabled,
					checked: () => insertDelete().insertColumnLeft.checked,
					info: () => insertDelete().insertColumnLeft.info,
					onClick: () => uiPort.emitInsertDelete("insertColumnLeft"),
				},
				{
					type: "button",
					label: "Insert column right",
					disabled: () => insertDelete().insertColumnRight.disabled,
					checked: () => insertDelete().insertColumnRight.checked,
					info: () => insertDelete().insertColumnRight.info,
					onClick: () => uiPort.emitInsertDelete("insertColumnRight"),
				},
				{
					type: "button",
					label: "Delete row",
					disabled: () => insertDelete().deleteRow.disabled,
					checked: () => insertDelete().deleteRow.checked,
					info: () => insertDelete().deleteRow.info,
					onClick: () => uiPort.emitInsertDelete("deleteRow"),
				},
				{
					type: "button",
					label: "Delete column",
					disabled: () => insertDelete().deleteColumn.disabled,
					checked: () => insertDelete().deleteColumn.checked,
					info: () => insertDelete().deleteColumn.info,
					onClick: () => uiPort.emitInsertDelete("deleteColumn"),
				},
			],
		},
		{
			type: "submenu",
			label: "Cell type",
			items: [
				{
					type: "button",
					label: "Header",
					disabled: () => cellType().header.disabled,
					checked: () => cellType().header.checked,
					info: () => cellType().header.info,
					onClick: () => uiPort.emitCellType("header"),
				},
				{
					type: "button",
					label: "Data",
					disabled: () => cellType().data.disabled,
					checked: () => cellType().data.checked,
					info: () => cellType().data.info,
					onClick: () => uiPort.emitCellType("data"),
				},
			],
		},
		{
			type: "submenu",
			label: "Vertical alignment",
			items: [
				{
					type: "button",
					label: "Top",
					disabled: () => verticalAlignment().top.disabled,
					checked: () => verticalAlignment().top.checked,
					info: () => verticalAlignment().top.info,
					onClick: () => uiPort.emitVerticalAlignment("top"),
				},
				{
					type: "button",
					label: "Middle",
					disabled: () => verticalAlignment().middle.disabled,
					checked: () => verticalAlignment().middle.checked,
					info: () => verticalAlignment().middle.info,
					onClick: () => uiPort.emitVerticalAlignment("middle"),
				},
				{
					type: "button",
					label: "Bottom",
					disabled: () => verticalAlignment().bottom.disabled,
					checked: () => verticalAlignment().bottom.checked,
					info: () => verticalAlignment().bottom.info,
					onClick: () => uiPort.emitVerticalAlignment("bottom"),
				},
			],
		},
		{
			type: "submenu",
			label: "Cell resizing",
			items: [
				{
					type: "button",
					label: "Equalize columns",
					disabled: () => cellResizing().equalizeColumns.disabled,
					checked: () => cellResizing().equalizeColumns.checked,
					info: () => cellResizing().equalizeColumns.info,
					onClick: () => uiPort.emitCellResizing("equalizeColumns"),
				},
				{
					type: "button",
					label: "Minimize rows",
					disabled: () => cellResizing().minimizeRows.disabled,
					checked: () => cellResizing().minimizeRows.checked,
					info: () => cellResizing().minimizeRows.info,
					onClick: () => uiPort.emitCellResizing("minimizeRows"),
				},
			],
		},
		{
			type: "button",
			label: "Clear contents",
			disabled: () => clearContents().disabled,
			checked: () => clearContents().checked,
			info: () => clearContents().info,
			onClick: () => uiPort.emitClearContents(),
		},
	];
}
