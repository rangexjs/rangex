import { createListAdapter, type ListSettings } from "#adapters/List";
import { configureList } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const List: AdapterFactoryFn<ListSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createListAdapter(settings, options);

		const cleanup = configureList({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.list = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
