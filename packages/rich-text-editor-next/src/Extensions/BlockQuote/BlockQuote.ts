import { BlockQuote as BlockQuoteFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { BlockQuoteToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const BlockQuote = (
	...adapterSettings: Parameters<typeof BlockQuoteFactory>
): Extension => {
	return {
		createAdapter: () => BlockQuoteFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.blockQuote]: BlockQuoteToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
