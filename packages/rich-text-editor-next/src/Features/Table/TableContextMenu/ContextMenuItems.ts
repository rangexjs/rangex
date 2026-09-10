import type { ReactiveTablePort } from "@rangex/solid";

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

export interface CreateContextMenuItemsParams {
	table: ReactiveTablePort;
}

export const createContextMenuItems = ({
	table,
}: CreateContextMenuItemsParams): ContextMenuItem[] => {
	return [
		{
			type: "submenu",
			label: "Section type",
			items: [
				{
					type: "button",
					label: "Header",
					disabled: () => table.sectionType().header.disabled,
					checked: () => table.sectionType().header.checked,
					info: () => table.sectionType().header.info,
					onClick: () => table.setSectionType("header"),
				},
				{
					type: "button",
					label: "Body",
					disabled: () => table.sectionType().body.disabled,
					checked: () => table.sectionType().body.checked,
					info: () => table.sectionType().body.info,
					onClick: () => table.setSectionType("body"),
				},
				{
					type: "button",
					label: "Footer",
					disabled: () => table.sectionType().footer.disabled,
					checked: () => table.sectionType().footer.checked,
					info: () => table.sectionType().footer.info,
					onClick: () => table.setSectionType("footer"),
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
					disabled: () => table.mergeSplit().mergeSelected.disabled,
					checked: () => table.mergeSplit().mergeSelected.checked,
					info: () => table.mergeSplit().mergeSelected.info,
					onClick: () => table.setMergeSplit("mergeSelected"),
				},
				{
					type: "button",
					label: "Merge up",
					disabled: () => table.mergeSplit().mergeUp.disabled,
					checked: () => table.mergeSplit().mergeUp.checked,
					info: () => table.mergeSplit().mergeUp.info,
					onClick: () => table.setMergeSplit("mergeUp"),
				},
				{
					type: "button",
					label: "Merge down",
					disabled: () => table.mergeSplit().mergeDown.disabled,
					checked: () => table.mergeSplit().mergeDown.checked,
					info: () => table.mergeSplit().mergeDown.info,
					onClick: () => table.setMergeSplit("mergeDown"),
				},
				{
					type: "button",
					label: "Merge left",
					disabled: () => table.mergeSplit().mergeLeft.disabled,
					checked: () => table.mergeSplit().mergeLeft.checked,
					info: () => table.mergeSplit().mergeLeft.info,
					onClick: () => table.setMergeSplit("mergeLeft"),
				},
				{
					type: "button",
					label: "Merge right",
					disabled: () => table.mergeSplit().mergeRight.disabled,
					checked: () => table.mergeSplit().mergeRight.checked,
					info: () => table.mergeSplit().mergeRight.info,
					onClick: () => table.setMergeSplit("mergeRight"),
				},
				{
					type: "button",
					label: "Split horizontally",
					disabled: () => table.mergeSplit().splitHorizontally.disabled,
					checked: () => table.mergeSplit().splitHorizontally.checked,
					info: () => table.mergeSplit().splitHorizontally.info,
					onClick: () => table.setMergeSplit("splitHorizontally"),
				},
				{
					type: "button",
					label: "Split vertically",
					disabled: () => table.mergeSplit().splitVertically.disabled,
					checked: () => table.mergeSplit().splitVertically.checked,
					info: () => table.mergeSplit().splitVertically.info,
					onClick: () => table.setMergeSplit("splitVertically"),
				},
				{
					type: "button",
					label: "Split fully",
					disabled: () => table.mergeSplit().splitFully.disabled,
					checked: () => table.mergeSplit().splitFully.checked,
					info: () => table.mergeSplit().splitFully.info,
					onClick: () => table.setMergeSplit("splitFully"),
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
					disabled: () => table.insertDelete().insertRowAbove.disabled,
					checked: () => table.insertDelete().insertRowAbove.checked,
					info: () => table.insertDelete().insertRowAbove.info,
					onClick: () => table.setInsertDelete("insertRowAbove"),
				},
				{
					type: "button",
					label: "Insert row below",
					disabled: () => table.insertDelete().insertRowBelow.disabled,
					checked: () => table.insertDelete().insertRowBelow.checked,
					info: () => table.insertDelete().insertRowBelow.info,
					onClick: () => table.setInsertDelete("insertRowBelow"),
				},
				{
					type: "button",
					label: "Insert column left",
					disabled: () => table.insertDelete().insertColumnLeft.disabled,
					checked: () => table.insertDelete().insertColumnLeft.checked,
					info: () => table.insertDelete().insertColumnLeft.info,
					onClick: () => table.setInsertDelete("insertColumnLeft"),
				},
				{
					type: "button",
					label: "Insert column right",
					disabled: () => table.insertDelete().insertColumnRight.disabled,
					checked: () => table.insertDelete().insertColumnRight.checked,
					info: () => table.insertDelete().insertColumnRight.info,
					onClick: () => table.setInsertDelete("insertColumnRight"),
				},
				{
					type: "button",
					label: "Delete row",
					disabled: () => table.insertDelete().deleteRow.disabled,
					checked: () => table.insertDelete().deleteRow.checked,
					info: () => table.insertDelete().deleteRow.info,
					onClick: () => table.setInsertDelete("deleteRow"),
				},
				{
					type: "button",
					label: "Delete column",
					disabled: () => table.insertDelete().deleteColumn.disabled,
					checked: () => table.insertDelete().deleteColumn.checked,
					info: () => table.insertDelete().deleteColumn.info,
					onClick: () => table.setInsertDelete("deleteColumn"),
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
					disabled: () => table.cellType().header.disabled,
					checked: () => table.cellType().header.checked,
					info: () => table.cellType().header.info,
					onClick: () => table.setCellType("header"),
				},
				{
					type: "button",
					label: "Data",
					disabled: () => table.cellType().data.disabled,
					checked: () => table.cellType().data.checked,
					info: () => table.cellType().data.info,
					onClick: () => table.setCellType("data"),
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
					disabled: () => table.verticalAlignment().top.disabled,
					checked: () => table.verticalAlignment().top.checked,
					info: () => table.verticalAlignment().top.info,
					onClick: () => table.setVerticalAlignment("top"),
				},
				{
					type: "button",
					label: "Middle",
					disabled: () => table.verticalAlignment().middle.disabled,
					checked: () => table.verticalAlignment().middle.checked,
					info: () => table.verticalAlignment().middle.info,
					onClick: () => table.setVerticalAlignment("middle"),
				},
				{
					type: "button",
					label: "Bottom",
					disabled: () => table.verticalAlignment().bottom.disabled,
					checked: () => table.verticalAlignment().bottom.checked,
					info: () => table.verticalAlignment().bottom.info,
					onClick: () => table.setVerticalAlignment("bottom"),
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
					disabled: () => table.cellResizing().equalizeColumns.disabled,
					checked: () => table.cellResizing().equalizeColumns.checked,
					info: () => table.cellResizing().equalizeColumns.info,
					onClick: () => table.setCellResizing("equalizeColumns"),
				},
				{
					type: "button",
					label: "Minimize rows",
					disabled: () => table.cellResizing().minimizeRows.disabled,
					checked: () => table.cellResizing().minimizeRows.checked,
					info: () => table.cellResizing().minimizeRows.info,
					onClick: () => table.setCellResizing("minimizeRows"),
				},
			],
		},
		{
			type: "button",
			label: "Clear contents",
			disabled: () => table.clearContents().disabled,
			checked: () => table.clearContents().checked,
			info: () => table.clearContents().info,
			onClick: () => table.clear(),
		},
	];
};
