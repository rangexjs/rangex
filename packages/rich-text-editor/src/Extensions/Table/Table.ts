import { TableAdapter } from "#adapters";
import { configureTable } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { TableToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Table = createExtension<typeof TableAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new TableAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureTable({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.table]: TableToolbarButton,
		},
	},
});
