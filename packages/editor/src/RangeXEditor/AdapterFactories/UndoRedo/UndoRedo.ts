import { createUndoRedoAdapter, type UndoRedoSettings } from "#adapters/UndoRedo";
import { configureUndoRedo } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const UndoRedo: AdapterFactoryFn<UndoRedoSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createUndoRedoAdapter(settings, options);

		editor.undoRedo = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureUndoRedo({
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
