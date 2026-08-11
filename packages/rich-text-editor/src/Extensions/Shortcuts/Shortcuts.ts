import { ShortcutsAdapter } from "#adapters";
import { configureShortcuts } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Shortcuts = createExtension<typeof ShortcutsAdapter>({
	createAdapter: (settings, options) => new ShortcutsAdapter(settings, options),
	configure: ({ editorAPI }) => configureShortcuts({ editorAPI }),
	components: {},
});
