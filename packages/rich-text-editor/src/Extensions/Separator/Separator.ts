import { SeparatorAdapter } from "#adapters";
import { configureSeparator } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { CustomComponentToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Separator = createExtension<typeof SeparatorAdapter>({
	createAdapter: (settings, options) => new SeparatorAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureSeparator({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
		},
	},
});
