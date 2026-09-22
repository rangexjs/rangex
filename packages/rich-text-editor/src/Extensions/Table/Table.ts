import { Table as TableFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { TableContextMenu, TableToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const Table = (
	...adapterSettings: Parameters<typeof TableFactory>
): Extension => {
	return {
		createAdapter: () => TableFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.table]: TableToolbarButton,
			},
			floatingComponents: [TableContextMenu],
		},
	};
};
