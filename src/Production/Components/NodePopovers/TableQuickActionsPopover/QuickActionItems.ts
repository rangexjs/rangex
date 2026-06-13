import type { Accessor } from "solid-js";
import type {
	TableQuickActionsCellResizingState,
	TableQuickActionsCellTypeState,
	TableQuickActionsClearContentsState,
	TableQuickActionsInsertDeleteState,
	TableQuickActionsMergeSplitState,
	TableQuickActionsPopoverController,
	TableQuickActionsSectionTypeState,
	TableQuickActionsVerticalAlignmentState,
} from "../../../PopoverControllers";

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
	sectionType: Accessor<TableQuickActionsSectionTypeState>;
	mergeSplit: Accessor<TableQuickActionsMergeSplitState>;
	insertDelete: Accessor<TableQuickActionsInsertDeleteState>;
	cellType: Accessor<TableQuickActionsCellTypeState>;
	verticalAlignment: Accessor<TableQuickActionsVerticalAlignmentState>;
	cellResizing: Accessor<TableQuickActionsCellResizingState>;
	clearContents: Accessor<TableQuickActionsClearContentsState>;
	controller: TableQuickActionsPopoverController;
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
		controller,
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
					onClick: () => controller.emitSectionType("header"),
				},
				{
					type: "button",
					label: "Body",
					disabled: () => sectionType().body.disabled,
					checked: () => sectionType().body.checked,
					info: () => sectionType().body.info,
					onClick: () => controller.emitSectionType("body"),
				},
				{
					type: "button",
					label: "Footer",
					disabled: () => sectionType().footer.disabled,
					checked: () => sectionType().footer.checked,
					info: () => sectionType().footer.info,
					onClick: () => controller.emitSectionType("footer"),
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
					onClick: () => controller.emitMergeSplit("mergeSelected"),
				},
				{
					type: "button",
					label: "Merge up",
					disabled: () => mergeSplit().mergeUp.disabled,
					checked: () => mergeSplit().mergeUp.checked,
					info: () => mergeSplit().mergeUp.info,
					onClick: () => controller.emitMergeSplit("mergeUp"),
				},
				{
					type: "button",
					label: "Merge down",
					disabled: () => mergeSplit().mergeDown.disabled,
					checked: () => mergeSplit().mergeDown.checked,
					info: () => mergeSplit().mergeDown.info,
					onClick: () => controller.emitMergeSplit("mergeDown"),
				},
				{
					type: "button",
					label: "Merge left",
					disabled: () => mergeSplit().mergeLeft.disabled,
					checked: () => mergeSplit().mergeLeft.checked,
					info: () => mergeSplit().mergeLeft.info,
					onClick: () => controller.emitMergeSplit("mergeLeft"),
				},
				{
					type: "button",
					label: "Merge right",
					disabled: () => mergeSplit().mergeRight.disabled,
					checked: () => mergeSplit().mergeRight.checked,
					info: () => mergeSplit().mergeRight.info,
					onClick: () => controller.emitMergeSplit("mergeRight"),
				},
				{
					type: "button",
					label: "Split horizontally",
					disabled: () => mergeSplit().splitHorizontally.disabled,
					checked: () => mergeSplit().splitHorizontally.checked,
					info: () => mergeSplit().splitHorizontally.info,
					onClick: () => controller.emitMergeSplit("splitHorizontally"),
				},
				{
					type: "button",
					label: "Split vertically",
					disabled: () => mergeSplit().splitVertically.disabled,
					checked: () => mergeSplit().splitVertically.checked,
					info: () => mergeSplit().splitVertically.info,
					onClick: () => controller.emitMergeSplit("splitVertically"),
				},
				{
					type: "button",
					label: "Split fully",
					disabled: () => mergeSplit().splitFully.disabled,
					checked: () => mergeSplit().splitFully.checked,
					info: () => mergeSplit().splitFully.info,
					onClick: () => controller.emitMergeSplit("splitFully"),
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
					onClick: () => controller.emitInsertDelete("insertRowAbove"),
				},
				{
					type: "button",
					label: "Insert row below",
					disabled: () => insertDelete().insertRowBelow.disabled,
					checked: () => insertDelete().insertRowBelow.checked,
					info: () => insertDelete().insertRowBelow.info,
					onClick: () => controller.emitInsertDelete("insertRowBelow"),
				},
				{
					type: "button",
					label: "Insert column left",
					disabled: () => insertDelete().insertColumnLeft.disabled,
					checked: () => insertDelete().insertColumnLeft.checked,
					info: () => insertDelete().insertColumnLeft.info,
					onClick: () => controller.emitInsertDelete("insertColumnLeft"),
				},
				{
					type: "button",
					label: "Insert column right",
					disabled: () => insertDelete().insertColumnRight.disabled,
					checked: () => insertDelete().insertColumnRight.checked,
					info: () => insertDelete().insertColumnRight.info,
					onClick: () => controller.emitInsertDelete("insertColumnRight"),
				},
				{
					type: "button",
					label: "Delete row",
					disabled: () => insertDelete().deleteRow.disabled,
					checked: () => insertDelete().deleteRow.checked,
					info: () => insertDelete().deleteRow.info,
					onClick: () => controller.emitInsertDelete("deleteRow"),
				},
				{
					type: "button",
					label: "Delete column",
					disabled: () => insertDelete().deleteColumn.disabled,
					checked: () => insertDelete().deleteColumn.checked,
					info: () => insertDelete().deleteColumn.info,
					onClick: () => controller.emitInsertDelete("deleteColumn"),
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
					onClick: () => controller.emitCellType("header"),
				},
				{
					type: "button",
					label: "Data",
					disabled: () => cellType().data.disabled,
					checked: () => cellType().data.checked,
					info: () => cellType().data.info,
					onClick: () => controller.emitCellType("data"),
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
					onClick: () => controller.emitVerticalAlignment("top"),
				},
				{
					type: "button",
					label: "Middle",
					disabled: () => verticalAlignment().middle.disabled,
					checked: () => verticalAlignment().middle.checked,
					info: () => verticalAlignment().middle.info,
					onClick: () => controller.emitVerticalAlignment("middle"),
				},
				{
					type: "button",
					label: "Bottom",
					disabled: () => verticalAlignment().bottom.disabled,
					checked: () => verticalAlignment().bottom.checked,
					info: () => verticalAlignment().bottom.info,
					onClick: () => controller.emitVerticalAlignment("bottom"),
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
					onClick: () => controller.emitCellResizing("equalizeColumns"),
				},
				{
					type: "button",
					label: "Minimize rows",
					disabled: () => cellResizing().minimizeRows.disabled,
					checked: () => cellResizing().minimizeRows.checked,
					info: () => cellResizing().minimizeRows.info,
					onClick: () => controller.emitCellResizing("minimizeRows"),
				},
			],
		},
		{
			type: "button",
			label: "Clear contents",
			disabled: () => clearContents().disabled,
			checked: () => clearContents().checked,
			info: () => clearContents().info,
			onClick: () => controller.emitClearContents(),
		},
	];
}
