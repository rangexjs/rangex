import { BlockQuoteAdapter } from "#adapters";
import { configureBlockQuote } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { BlockQuoteToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const BlockQuote = createExtension<typeof BlockQuoteAdapter>({
	createAdapter: (settings, options) =>
		new BlockQuoteAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureBlockQuote({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.blockQuote]: BlockQuoteToolbarButton,
		},
	},
});
