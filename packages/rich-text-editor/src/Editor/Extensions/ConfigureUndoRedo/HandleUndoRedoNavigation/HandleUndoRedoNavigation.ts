import type { HandleUndoRedoNavigationParams } from "./HandleUndoRedoNavigation-types";

export const handleUndoRedoNavigation = ({
	editorPort,
	editorAPI,
}: HandleUndoRedoNavigationParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorPort.onNavigate(({ type }) => {
		if (type === "history-back") {
			snapshotTimeline.stepBack();
		}

		if (type === "history-forward") {
			snapshotTimeline.stepForward();
		}

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
