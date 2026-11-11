import { Symbols as SymbolsFactory } from "@rangex/editor/symbols";

import { toolbarButtonsName } from "#constants";
import { SymbolsToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { SymbolsExtensionSettings } from "./Symbols-types";

export const Symbols = (settings: SymbolsExtensionSettings): Extension => {
	return {
		createAdapter: () => SymbolsFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.symbols]: SymbolsToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
