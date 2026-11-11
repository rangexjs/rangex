import type {
	TableCellResizingAction,
	TableCellTypeAction,
	TableInsertDeleteAction,
	TableMergeSplitAction,
	TablePublicPort,
	TableSectionTypeAction,
	TableVerticalAlignmentAction,
} from "@rangex/editor/table";
import type { ReactiveTablePort } from "@rangex/solid";
import type { TableContextMenuUIOptions } from "#context";

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
	items: ContextMenuItem[];
}

export type ContextMenuItem = ActionItem | SubmenuItem;

/** Returns the items of the given actions, in the given order, skipping duplicates. */
const selectItems = <Action extends string>(
	actions: Action[],
	items: Record<Action, ActionItem>,
): ActionItem[] => {
	const uniqueActions = [...new Set(actions)];

	return uniqueActions.map((action) => items[action]);
};

export interface CreateContextMenuItemsParams {
	table: TablePublicPort;
	$table: ReactiveTablePort;
	options: TableContextMenuUIOptions;
}

export const createContextMenuItems = ({
	table,
	$table,
	options,
}: CreateContextMenuItemsParams): ContextMenuItem[] => {
	const {
		sectionType = [],
		mergeSplit = [],
		insertDelete = [],
		cellType = [],
		verticalAlignment = [],
		cellResizing = [],
		clearContents = false,
	} = options;

	const sectionTypeItems: Record<TableSectionTypeAction, ActionItem> = {
		header: {
			type: "button",
			label: "Header",
			disabled: () => $table.sectionType().header.disabled,
			checked: () => $table.sectionType().header.checked,
			info: () => $table.sectionType().header.info,
			onClick: () => table.changeSectionType("header"),
		},
		body: {
			type: "button",
			label: "Body",
			disabled: () => $table.sectionType().body.disabled,
			checked: () => $table.sectionType().body.checked,
			info: () => $table.sectionType().body.info,
			onClick: () => table.changeSectionType("body"),
		},
		footer: {
			type: "button",
			label: "Footer",
			disabled: () => $table.sectionType().footer.disabled,
			checked: () => $table.sectionType().footer.checked,
			info: () => $table.sectionType().footer.info,
			onClick: () => table.changeSectionType("footer"),
		},
	};

	const mergeSplitItems: Record<TableMergeSplitAction, ActionItem> = {
		mergeSelected: {
			type: "button",
			label: "Merge selected",
			disabled: () => $table.mergeSplit().mergeSelected.disabled,
			checked: () => $table.mergeSplit().mergeSelected.checked,
			info: () => $table.mergeSplit().mergeSelected.info,
			onClick: () => table.changeMergeSplit("mergeSelected"),
		},
		mergeUp: {
			type: "button",
			label: "Merge up",
			disabled: () => $table.mergeSplit().mergeUp.disabled,
			checked: () => $table.mergeSplit().mergeUp.checked,
			info: () => $table.mergeSplit().mergeUp.info,
			onClick: () => table.changeMergeSplit("mergeUp"),
		},
		mergeDown: {
			type: "button",
			label: "Merge down",
			disabled: () => $table.mergeSplit().mergeDown.disabled,
			checked: () => $table.mergeSplit().mergeDown.checked,
			info: () => $table.mergeSplit().mergeDown.info,
			onClick: () => table.changeMergeSplit("mergeDown"),
		},
		mergeLeft: {
			type: "button",
			label: "Merge left",
			disabled: () => $table.mergeSplit().mergeLeft.disabled,
			checked: () => $table.mergeSplit().mergeLeft.checked,
			info: () => $table.mergeSplit().mergeLeft.info,
			onClick: () => table.changeMergeSplit("mergeLeft"),
		},
		mergeRight: {
			type: "button",
			label: "Merge right",
			disabled: () => $table.mergeSplit().mergeRight.disabled,
			checked: () => $table.mergeSplit().mergeRight.checked,
			info: () => $table.mergeSplit().mergeRight.info,
			onClick: () => table.changeMergeSplit("mergeRight"),
		},
		splitHorizontally: {
			type: "button",
			label: "Split horizontally",
			disabled: () => $table.mergeSplit().splitHorizontally.disabled,
			checked: () => $table.mergeSplit().splitHorizontally.checked,
			info: () => $table.mergeSplit().splitHorizontally.info,
			onClick: () => table.changeMergeSplit("splitHorizontally"),
		},
		splitVertically: {
			type: "button",
			label: "Split vertically",
			disabled: () => $table.mergeSplit().splitVertically.disabled,
			checked: () => $table.mergeSplit().splitVertically.checked,
			info: () => $table.mergeSplit().splitVertically.info,
			onClick: () => table.changeMergeSplit("splitVertically"),
		},
		splitFully: {
			type: "button",
			label: "Split fully",
			disabled: () => $table.mergeSplit().splitFully.disabled,
			checked: () => $table.mergeSplit().splitFully.checked,
			info: () => $table.mergeSplit().splitFully.info,
			onClick: () => table.changeMergeSplit("splitFully"),
		},
	};

	const insertDeleteItems: Record<TableInsertDeleteAction, ActionItem> = {
		insertRowAbove: {
			type: "button",
			label: "Insert row above",
			disabled: () => $table.insertDelete().insertRowAbove.disabled,
			checked: () => $table.insertDelete().insertRowAbove.checked,
			info: () => $table.insertDelete().insertRowAbove.info,
			onClick: () => table.changeInsertDelete("insertRowAbove"),
		},
		insertRowBelow: {
			type: "button",
			label: "Insert row below",
			disabled: () => $table.insertDelete().insertRowBelow.disabled,
			checked: () => $table.insertDelete().insertRowBelow.checked,
			info: () => $table.insertDelete().insertRowBelow.info,
			onClick: () => table.changeInsertDelete("insertRowBelow"),
		},
		insertColumnLeft: {
			type: "button",
			label: "Insert column left",
			disabled: () => $table.insertDelete().insertColumnLeft.disabled,
			checked: () => $table.insertDelete().insertColumnLeft.checked,
			info: () => $table.insertDelete().insertColumnLeft.info,
			onClick: () => table.changeInsertDelete("insertColumnLeft"),
		},
		insertColumnRight: {
			type: "button",
			label: "Insert column right",
			disabled: () => $table.insertDelete().insertColumnRight.disabled,
			checked: () => $table.insertDelete().insertColumnRight.checked,
			info: () => $table.insertDelete().insertColumnRight.info,
			onClick: () => table.changeInsertDelete("insertColumnRight"),
		},
		deleteRow: {
			type: "button",
			label: "Delete row",
			disabled: () => $table.insertDelete().deleteRow.disabled,
			checked: () => $table.insertDelete().deleteRow.checked,
			info: () => $table.insertDelete().deleteRow.info,
			onClick: () => table.changeInsertDelete("deleteRow"),
		},
		deleteColumn: {
			type: "button",
			label: "Delete column",
			disabled: () => $table.insertDelete().deleteColumn.disabled,
			checked: () => $table.insertDelete().deleteColumn.checked,
			info: () => $table.insertDelete().deleteColumn.info,
			onClick: () => table.changeInsertDelete("deleteColumn"),
		},
	};

	const cellTypeItems: Record<TableCellTypeAction, ActionItem> = {
		header: {
			type: "button",
			label: "Header",
			disabled: () => $table.cellType().header.disabled,
			checked: () => $table.cellType().header.checked,
			info: () => $table.cellType().header.info,
			onClick: () => table.changeCellType("header"),
		},
		data: {
			type: "button",
			label: "Data",
			disabled: () => $table.cellType().data.disabled,
			checked: () => $table.cellType().data.checked,
			info: () => $table.cellType().data.info,
			onClick: () => table.changeCellType("data"),
		},
	};

	const verticalAlignmentItems: Record<
		TableVerticalAlignmentAction,
		ActionItem
	> = {
		start: {
			type: "button",
			label: "Top",
			disabled: () => $table.verticalAlignment().start.disabled,
			checked: () => $table.verticalAlignment().start.checked,
			info: () => $table.verticalAlignment().start.info,
			onClick: () => table.changeVerticalAlignment("start"),
		},
		center: {
			type: "button",
			label: "Middle",
			disabled: () => $table.verticalAlignment().center.disabled,
			checked: () => $table.verticalAlignment().center.checked,
			info: () => $table.verticalAlignment().center.info,
			onClick: () => table.changeVerticalAlignment("center"),
		},
		end: {
			type: "button",
			label: "Bottom",
			disabled: () => $table.verticalAlignment().end.disabled,
			checked: () => $table.verticalAlignment().end.checked,
			info: () => $table.verticalAlignment().end.info,
			onClick: () => table.changeVerticalAlignment("end"),
		},
	};

	const cellResizingItems: Record<TableCellResizingAction, ActionItem> = {
		equalizeColumns: {
			type: "button",
			label: "Equalize columns",
			disabled: () => $table.cellResizing().equalizeColumns.disabled,
			checked: () => $table.cellResizing().equalizeColumns.checked,
			info: () => $table.cellResizing().equalizeColumns.info,
			onClick: () => table.changeCellResizing("equalizeColumns"),
		},
		minimizeRows: {
			type: "button",
			label: "Minimize rows",
			disabled: () => $table.cellResizing().minimizeRows.disabled,
			checked: () => $table.cellResizing().minimizeRows.checked,
			info: () => $table.cellResizing().minimizeRows.info,
			onClick: () => table.changeCellResizing("minimizeRows"),
		},
	};

	const submenus: SubmenuItem[] = [
		{
			type: "submenu",
			label: "Section type",
			items: selectItems(sectionType, sectionTypeItems),
		},
		{
			type: "submenu",
			label: "Merge & Split",
			items: selectItems(mergeSplit, mergeSplitItems),
		},
		{
			type: "submenu",
			label: "Insert & Delete",
			items: selectItems(insertDelete, insertDeleteItems),
		},
		{
			type: "submenu",
			label: "Cell type",
			items: selectItems(cellType, cellTypeItems),
		},
		{
			type: "submenu",
			label: "Vertical alignment",
			items: selectItems(verticalAlignment, verticalAlignmentItems),
		},
		{
			type: "submenu",
			label: "Cell resizing",
			items: selectItems(cellResizing, cellResizingItems),
		},
	];

	const items: ContextMenuItem[] = submenus.filter(
		(submenu) => submenu.items.length > 0,
	);

	if (clearContents) {
		items.push({
			type: "button",
			label: "Clear contents",
			disabled: () => $table.clearContents().disabled,
			checked: () => $table.clearContents().checked,
			info: () => $table.clearContents().info,
			onClick: () => table.clear(),
		});
	}

	return items;
};
