import {
	createUndoRedoAdapter,
	type UndoRedoSettings,
} from "#adapters/UndoRedo";
import { configureUndoRedo } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const UndoRedo: AdapterFactoryFn<UndoRedoSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createUndoRedoAdapter(settings, options);

		const cleanup = configureUndoRedo({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.undoRedo = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
