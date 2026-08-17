import { ReadOnlyAdapter } from "#adapters";
import { configureReadOnly } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { ReadOnlyToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const ReadOnly = createExtension<typeof ReadOnlyAdapter>({
	createAdapter: (settings, options) => new ReadOnlyAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureReadOnly({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.readOnly]: ReadOnlyToolbarButton,
		},
	},
});
