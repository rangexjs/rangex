import { ImageAdapter } from "#adapters";
import { configureImage } from "#editor-extensions";
import { extensionsName } from "#ports";
import { createExtension } from "../_Utilities";

export const Image = createExtension({
	name: extensionsName.image,
	defaultSettings: {},
	createAdapter: (settings, options) => new ImageAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureImage({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
