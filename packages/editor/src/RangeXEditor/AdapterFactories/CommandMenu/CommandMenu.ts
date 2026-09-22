import {
	type CommandMenuSettings,
	createCommandMenuAdapter,
} from "#adapters/CommandMenu";
import { configureCommandMenu } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const CommandMenu: AdapterFactoryFn<CommandMenuSettings> = (
	settings,
) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createCommandMenuAdapter(settings, options);

		const cleanup = configureCommandMenu({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.commandMenu = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
