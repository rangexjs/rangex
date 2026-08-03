import { ImageAdapter } from "#adapters";
import { configureImage } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Image = createExtension<typeof ImageAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new ImageAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureImage({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
