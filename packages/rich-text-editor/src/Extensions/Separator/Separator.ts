import { Separator as SeparatorFactory } from "@rangex/editor/separator";
import { toolbarButtonsName } from "#constants";
import { CustomComponentToolbarButton } from "#features";
import type { Extension } from "../_Utilities";
import type { SeparatorExtensionSettings } from "./Separator-types";

export const Separator = (settings: SeparatorExtensionSettings): Extension => {
	return {
		createAdapter: () => SeparatorFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
