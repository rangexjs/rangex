import { BlockQuote as BlockQuoteFactory } from "@rangex/editor/block-quote";

import { toolbarButtonsName } from "#constants";
import { BlockQuoteToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { BlockQuoteExtensionSettings } from "./BlockQuote-types";

export const BlockQuote = (settings: BlockQuoteExtensionSettings): Extension => {
	return {
		createAdapter: () => BlockQuoteFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.blockQuote]: BlockQuoteToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
