import { List as ListFactory } from "@rangex/editor/list";
import { toolbarButtonsName } from "#constants";
import {
	OrderedListToolbarButton,
	UnorderedListToolbarButton,
} from "#features";
import type { Extension } from "../_Utilities";

export const List = (
	...adapterSettings: Parameters<typeof ListFactory>
): Extension => {
	return {
		createAdapter: () => ListFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.orderedList]: OrderedListToolbarButton,
				[toolbarButtonsName.unorderedList]: UnorderedListToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
