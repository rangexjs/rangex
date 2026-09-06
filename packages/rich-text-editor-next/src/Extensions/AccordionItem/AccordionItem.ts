import { AccordionItem as AccordionItemFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { CustomComponentToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const AccordionItem = (
	...adapterSettings: Parameters<typeof AccordionItemFactory>
): Extension => {
	return {
		createAdapter: () => AccordionItemFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
			},
		},
	};
};
