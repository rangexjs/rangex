import {
	createShortcutsAdapter,
	type ShortcutsSettings,
} from "#adapters/Shortcuts";
import { configureShortcuts } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Shortcuts: AdapterFactoryFn<ShortcutsSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createShortcutsAdapter(settings, options);

		editor.shortcuts = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureShortcuts({ editorAPI });

				return () => {
					cleanup();
				};
			},
		};
	};
};
