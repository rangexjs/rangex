import { type AccordionItemSettings, createAccordionItemAdapter } from "#adapters/AccordionItem";
import { configureAccordionItem } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const AccordionItem: AdapterFactoryFn<AccordionItemSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createAccordionItemAdapter(settings, options);

		editor.accordionItem = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureAccordionItem({
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
