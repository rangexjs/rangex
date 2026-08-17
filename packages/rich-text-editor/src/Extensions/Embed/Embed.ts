import { EmbedAdapter } from "#adapters";
import { configureEmbed } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Embed = createExtension<typeof EmbedAdapter>({
	createAdapter: (settings, options) => new EmbedAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureEmbed({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
