import { Table as TableFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import type { TableContextMenuUIOptions, TableUIOptions } from "#context";
import { TableContextMenu, TableToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

const defaultContextMenu: Required<TableContextMenuUIOptions> = {
	sectionType: ["header", "body", "footer"],
	mergeSplit: ["mergeSelected", "splitFully"],
	insertDelete: [
		"insertRowAbove",
		"insertRowBelow",
		"insertColumnLeft",
		"insertColumnRight",
		"deleteRow",
		"deleteColumn",
	],
	cellType: ["header", "data"],
	verticalAlignment: ["top", "middle", "bottom"],
	cellResizing: ["equalizeColumns", "minimizeRows"],
	clearContents: true,
};

export const Table = (
	settings: Parameters<typeof TableFactory>[0] & TableUIOptions,
): Extension => {
	const { contextMenu, ...adapterSettings } = settings;

	return {
		createAdapter: () => TableFactory(adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.table]: TableToolbarButton,
			},
			floatingComponents: [TableContextMenu],
		},
		uiOptions: {
			table: {
				contextMenu: { ...defaultContextMenu, ...contextMenu },
			},
		},
	};
};
