import {
	createReadOnlyAdapter,
	type ReadOnlySettings,
} from "#adapters/ReadOnly";
import { configureReadOnly } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const ReadOnly: AdapterFactoryFn<ReadOnlySettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createReadOnlyAdapter(settings, options);

		editor.readOnly = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureReadOnly({
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
