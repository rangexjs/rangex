import {
	createShortcutsAdapter,
	type ShortcutsSettings,
} from "#adapters/Shortcuts";
import { configureShortcuts } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Shortcuts: AdapterFactoryFn<ShortcutsSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createShortcutsAdapter(settings, options);

		const cleanup = configureShortcuts({ editorAPI });

		editor.shortcuts = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
