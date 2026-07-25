import { UndoRedoAdapter } from "#adapters";
import { configureUndoRedo } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import {
	HistoryBackToolbarButton,
	HistoryForwardToolbarButton,
} from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const UndoRedo = createExtension({
	name: extensionsName.undoRedo,
	defaultSettings: {},
	createAdapter: () => new UndoRedoAdapter(),
	configure: ({ adapter, editorAPI }) =>
		configureUndoRedo({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
			[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
		},
	},
});
