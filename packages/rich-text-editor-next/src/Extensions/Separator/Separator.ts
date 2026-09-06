import { Separator as SeparatorFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { CustomComponentToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const Separator = (
	...adapterSettings: Parameters<typeof SeparatorFactory>
): Extension => {
	return {
		createAdapter: () => SeparatorFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.customComponent]: CustomComponentToolbarButton,
			},
		},
	};
};
