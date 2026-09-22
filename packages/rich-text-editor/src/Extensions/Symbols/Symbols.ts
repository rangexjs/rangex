import { Symbols as SymbolsFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { SymbolsToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const Symbols = (
	...adapterSettings: Parameters<typeof SymbolsFactory>
): Extension => {
	return {
		createAdapter: () => SymbolsFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.symbols]: SymbolsToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
