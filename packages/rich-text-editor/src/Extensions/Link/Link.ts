import { LinkAdapter } from "#adapters";
import { configureLink } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { LinkToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Link = createExtension<typeof LinkAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new LinkAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureLink({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.link]: LinkToolbarButton,
		},
	},
});
