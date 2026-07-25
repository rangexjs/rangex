import { BlockQuoteAdapter } from "#adapters";
import { configureBlockQuote } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import { BlockQuoteToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const BlockQuote = createExtension({
	name: extensionsName.blockQuote,
	defaultSettings: {},
	createAdapter: () => new BlockQuoteAdapter(),
	configure: ({ adapter, editorAPI }) =>
		configureBlockQuote({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.blockQuote]: BlockQuoteToolbarButton,
		},
	},
});
