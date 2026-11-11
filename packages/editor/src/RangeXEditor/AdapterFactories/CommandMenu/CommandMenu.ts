import { type CommandMenuSettings, createCommandMenuAdapter } from "#adapters/CommandMenu";
import { configureCommandMenu } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const CommandMenu: AdapterFactoryFn<CommandMenuSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createCommandMenuAdapter(settings, options);

		editor.commandMenu = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureCommandMenu({
					adapterBus: options.adapterBus,
					configPort: adapter.configPort,
					editorAPI,
				});

				return () => {
					cleanup();
				};
			},
		};
	};
};
