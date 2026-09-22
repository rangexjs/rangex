import { snapshotIndexChangeEventType } from "rich-text-area";
import type { HandleUndoRedoButtonStateParams } from "./HandleUndoRedoButtonState-types";

/*
 * Updates the undo/redo buttons' enabled state whenever the snapshot timeline's current index changes.
 */
export const handleUndoRedoButtonState = ({
	configPort,
	editorAPI,
}: HandleUndoRedoButtonStateParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			configPort.updateState({
				canStepBack: snapshotTimeline.canStepBack,
				canStepForward: snapshotTimeline.canStepForward,
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
