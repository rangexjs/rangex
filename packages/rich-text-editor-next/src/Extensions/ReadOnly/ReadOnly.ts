import { ReadOnly as ReadOnlyFactory } from "@rangex/editor";
import { toolbarButtonsName } from "#constants";
import { ReadOnlyToolbarButton } from "#features";
import type { Extension } from "../_Utilities";

export const ReadOnly = (
	...adapterSettings: Parameters<typeof ReadOnlyFactory>
): Extension => {
	return {
		createAdapter: () => ReadOnlyFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.readOnly]: ReadOnlyToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
