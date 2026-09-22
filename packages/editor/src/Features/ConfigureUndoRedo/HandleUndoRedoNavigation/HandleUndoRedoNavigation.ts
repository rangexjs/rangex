import type { HandleUndoRedoNavigationParams } from "./HandleUndoRedoNavigation-types";

/*
 * Listens for step back/forward requests and moves the snapshot timeline accordingly, refocusing
 * the editor after each step. Returns a cleanup function that unsubscribes both listeners.
 */
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
