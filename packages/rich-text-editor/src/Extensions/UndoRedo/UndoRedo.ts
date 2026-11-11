import { UndoRedo as UndoRedoFactory } from "@rangex/editor/undo-redo";

import { toolbarButtonsName } from "#constants";
import { HistoryBackToolbarButton, HistoryForwardToolbarButton } from "#features";

import type { Extension } from "../_Utilities";
import type { UndoRedoExtensionSettings } from "./UndoRedo-types";

export const UndoRedo = (settings: UndoRedoExtensionSettings): Extension => {
	return {
		createAdapter: () => UndoRedoFactory(settings),
		components: {
			toolbarButtons: {
				[toolbarButtonsName.historyBack]: HistoryBackToolbarButton,
				[toolbarButtonsName.historyForward]: HistoryForwardToolbarButton,
			},
			floatingComponents: [],
		},
	};
};
