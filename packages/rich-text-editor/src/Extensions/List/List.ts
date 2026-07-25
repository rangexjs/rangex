import { ListAdapter } from "#adapters";
import { configureList } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import {
	OrderedListToolbarButton,
	UnorderedListToolbarButton,
} from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const List = createExtension({
	name: extensionsName.list,
	defaultSettings: {},
	createAdapter: () => new ListAdapter(),
	configure: ({ adapter, editorAPI }) =>
		configureList({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.orderedList]: OrderedListToolbarButton,
			[toolbarButtonsName.unorderedList]: UnorderedListToolbarButton,
		},
	},
});
