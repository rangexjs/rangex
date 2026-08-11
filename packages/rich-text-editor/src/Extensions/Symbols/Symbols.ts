import { SymbolsAdapter } from "#adapters";
import { configureSymbols } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import { SymbolsToolbarButton } from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Symbols = createExtension<typeof SymbolsAdapter>({
	createAdapter: (settings, options) => new SymbolsAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureSymbols({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.symbols]: SymbolsToolbarButton,
		},
	},
});
