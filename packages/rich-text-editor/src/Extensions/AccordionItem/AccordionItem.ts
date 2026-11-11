import { AccordionItem as AccordionItemFactory } from "@rangex/editor/accordion-item";

import { toolbarButtonsName } from "#constants";
import { CustomComponentToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { AccordionItemExtensionSettings } from "./AccordionItem-types";

export const AccordionItem = (settings: AccordionItemExtensionSettings): Extension => {
	return {
		createAdapter: () => AccordionItemFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
