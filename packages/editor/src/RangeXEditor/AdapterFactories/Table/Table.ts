import { createTableAdapter, type TableSettings } from "#adapters/Table";
import { configureTable } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Table: AdapterFactoryFn<TableSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createTableAdapter(settings, options);

		editor.table = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureTable({
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
