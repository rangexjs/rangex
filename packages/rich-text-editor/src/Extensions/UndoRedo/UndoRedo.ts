import { UndoRedo as UndoRedoFactory } from "@rangex/editor/undo-redo";
import { toolbarButtonsName } from "#constants";
import {
	HistoryBackToolbarButton,
	HistoryForwardToolbarButton,
} from "#features";
import type { Extension } from "../_Utilities";

export const UndoRedo = (
	...adapterSettings: Parameters<typeof UndoRedoFactory>
): Extension => {
	return {
		createAdapter: () => UndoRedoFactory(...adapterSettings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
				[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
