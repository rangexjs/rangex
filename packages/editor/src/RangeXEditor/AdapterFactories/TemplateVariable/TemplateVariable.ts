import {
	createTemplateVariableAdapter,
	type TemplateVariableSettings,
} from "#adapters/TemplateVariable";
import { configureTemplateVariable } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const TemplateVariable: AdapterFactoryFn<TemplateVariableSettings> = (
	settings,
) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createTemplateVariableAdapter(settings, options);

		const cleanup = configureTemplateVariable({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.templateVariable = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
