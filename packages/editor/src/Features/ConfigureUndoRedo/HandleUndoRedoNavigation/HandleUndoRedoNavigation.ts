import type { HandleUndoRedoNavigationParams } from "./HandleUndoRedoNavigation-types";

export const handleUndoRedoNavigation = ({
	configPort,
	editorAPI,
}: HandleUndoRedoNavigationParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribeStepBack = configPort.onStepBack(() => {
		snapshotTimeline.stepBack();
		editorAPI.focus();
	});

	const unsubscribeStepForward = configPort.onStepForward(() => {
		snapshotTimeline.stepForward();
		editorAPI.focus();
	});

	return () => {
		unsubscribeStepBack();
		unsubscribeStepForward();
	};
};
