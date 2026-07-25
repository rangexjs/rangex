import { VideoAdapter } from "#adapters";
import { configureVideo } from "#editor-extensions";
import { extensionsName } from "#ports";
import { createExtension } from "../_Utilities";

export const Video = createExtension({
	name: extensionsName.video,
	defaultSettings: {},
	createAdapter: (settings, options) => new VideoAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureVideo({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
