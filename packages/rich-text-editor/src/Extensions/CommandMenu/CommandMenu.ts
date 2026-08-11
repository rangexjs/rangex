import { CommandMenuAdapter } from "#adapters";
import { configureCommandMenu } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const CommandMenu = createExtension<typeof CommandMenuAdapter>({
	createAdapter: (settings, options) =>
		new CommandMenuAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureCommandMenu({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
