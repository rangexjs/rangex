import { UndoRedoAdapter } from "#adapters";
import { configureUndoRedo } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
import {
	HistoryBackToolbarButton,
	HistoryForwardToolbarButton,
} from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const UndoRedo = createExtension<typeof UndoRedoAdapter>({
	defaultSettings: {},
	createAdapter: (settings, options) => new UndoRedoAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureUndoRedo({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
			[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
		},
	},
});
