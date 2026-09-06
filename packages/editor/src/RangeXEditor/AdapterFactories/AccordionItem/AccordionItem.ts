import {
	type AccordionItemSettings,
	createAccordionItemAdapter,
} from "#adapters/AccordionItem";
import { configureAccordionItem } from "#engine-links";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const AccordionItem: AdapterFactoryFn<AccordionItemSettings> = (
	settings,
) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createAccordionItemAdapter(settings, options);

		const cleanup = configureAccordionItem({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.accordionItem = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
