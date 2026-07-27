import { snapshotIndexChangeEventType } from "rich-text-area";
import type { HandleUndoRedoButtonStateParams } from "./HandleUndoRedoButtonState-types";

export const handleUndoRedoButtonState = ({
	editorPort,
	editorAPI,
}: HandleUndoRedoButtonStateParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			editorPort.updateState({
				historyBackToolbarButton: {
					disabled: !snapshotTimeline.canStepBack,
				},
				historyForwardToolbarButton: {
					disabled: !snapshotTimeline.canStepForward,
				},
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
