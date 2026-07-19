import { LinkAdapter } from "#adapters";
import { configureLink } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import { LinkPopover, LinkToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Link = createExtension({
	name: extensionsName.link,
	defaultSettings: {},
	createAdapter: (settings) => new LinkAdapter(settings),
	configure: ({ adapter, editorAPI }) =>
		configureLink({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.link]: LinkToolbarButton,
		},
		popover: LinkPopover,
	},
});
