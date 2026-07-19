import { LinkAdapter } from "#adapters";
import { configureLink } from "#editor-extensions";
import { LinkPopover, LinkToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Link = createExtension({
	name: "link",
	defaultSettings: {},
	createAdapter: (settings) => new LinkAdapter(settings),
	configure: ({ adapter, editorAPI }) =>
		configureLink({ linkPort: adapter.port, editorAPI }),
	components: {
		toolbarButton: LinkToolbarButton,
		popover: LinkPopover,
	},
});
