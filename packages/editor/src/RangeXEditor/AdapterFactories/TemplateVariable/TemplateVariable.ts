import {
	createTemplateVariableAdapter,
	type TemplateVariableSettings,
} from "#adapters/TemplateVariable";
import { configureTemplateVariable } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const TemplateVariable: AdapterFactoryFn<TemplateVariableSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createTemplateVariableAdapter(settings, options);

		editor.templateVariable = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureTemplateVariable({
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
