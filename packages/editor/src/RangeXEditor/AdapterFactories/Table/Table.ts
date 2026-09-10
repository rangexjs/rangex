import { createTableAdapter, type TableSettings } from "#adapters/Table";
import { configureTable } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Table: AdapterFactoryFn<TableSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createTableAdapter(settings, options);

		const cleanup = configureTable({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.table = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
