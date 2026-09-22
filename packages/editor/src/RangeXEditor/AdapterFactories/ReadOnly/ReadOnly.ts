import {
	createReadOnlyAdapter,
	type ReadOnlySettings,
} from "#adapters/ReadOnly";
import { configureReadOnly } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const ReadOnly: AdapterFactoryFn<ReadOnlySettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createReadOnlyAdapter(settings, options);

		const cleanup = configureReadOnly({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.readOnly = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
