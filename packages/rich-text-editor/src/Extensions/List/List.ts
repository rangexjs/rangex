import { List as ListFactory } from "@rangex/editor/list";

import { toolbarButtonsName } from "#constants";
import { OrderedListToolbarButton, UnorderedListToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { ListExtensionSettings } from "./List-types";

export const List = (settings: ListExtensionSettings): Extension => {
	return {
		createAdapter: () => ListFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.orderedList]: OrderedListToolbarButton,
				[toolbarButtonsName.unorderedList]: UnorderedListToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
