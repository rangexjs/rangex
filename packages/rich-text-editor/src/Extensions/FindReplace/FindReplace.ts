import { FindReplaceAdapter } from "#adapters";
import { configureFindReplace } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { FindReplaceToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const FindReplace = createExtension<typeof FindReplaceAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) =>
		new FindReplaceAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureFindReplace({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.findReplace]: FindReplaceToolbarButton,
		},
	},
});
