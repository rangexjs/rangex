import { FindReplace as FindReplaceFactory } from "@rangex/editor/find-replace";
import { toolbarButtonsName } from "#constants";
import { FindReplaceToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const FindReplace = (
	...adapterSettings: Parameters<typeof FindReplaceFactory>
): Extension => {
	return {
		createAdapter: () => FindReplaceFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.findReplace]: FindReplaceToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
