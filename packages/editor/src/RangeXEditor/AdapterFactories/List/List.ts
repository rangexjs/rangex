import { createListAdapter, type ListSettings } from "#adapters/List";
import { configureList } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const List: AdapterFactoryFn<ListSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createListAdapter(settings, options);

		editor.list = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureList({
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
