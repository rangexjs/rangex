import { AudioAdapter } from "#adapters";
import { configureAudio } from "#editor-extensions";
import { extensionsName } from "#ports";
import { createExtension } from "../_Utilities";

export const Audio = createExtension({
	name: extensionsName.audio,
	defaultSettings: {},
	createAdapter: (settings, options) => new AudioAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureAudio({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
