import { AccordionItemAdapter } from "#adapters";
import { configureAccordionItem } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import { CustomComponentToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const AccordionItem = createExtension({
	name: extensionsName.accordionItem,
	defaultSettings: {},
	createAdapter: (settings, options) =>
		new AccordionItemAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureAccordionItem({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
		},
	},
});
