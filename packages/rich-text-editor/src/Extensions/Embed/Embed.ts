import { EmbedAdapter } from "#adapters";
import { configureEmbed } from "#editor-extensions";
import { extensionsName } from "#ports";
import { createExtension } from "../_Utilities";

export const Embed = createExtension({
	name: extensionsName.embed,
	defaultSettings: {},
	createAdapter: (settings, options) => new EmbedAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureEmbed({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
