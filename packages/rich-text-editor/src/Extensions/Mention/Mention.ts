import { MentionAdapter } from "#adapters";
import { configureMention } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Mention = createExtension<typeof MentionAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new MentionAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureMention({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
