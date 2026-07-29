import { CommandMenuAdapter } from "#adapters";
import { configureCommandMenu } from "#editor-extensions";
import { commandMenuItemsName } from "#ports";
import { createExtension } from "../_Utilities";

const defaultItems = Object.values(commandMenuItemsName);

export const CommandMenu = createExtension<typeof CommandMenuAdapter>({
	defaultSettings: { items: defaultItems },
	createAdapter: (settings, options) =>
		new CommandMenuAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureCommandMenu({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
