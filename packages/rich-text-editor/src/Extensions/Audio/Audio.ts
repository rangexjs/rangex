import { AudioAdapter } from "#adapters";
import { configureAudio } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Audio = createExtension<typeof AudioAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new AudioAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureAudio({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
