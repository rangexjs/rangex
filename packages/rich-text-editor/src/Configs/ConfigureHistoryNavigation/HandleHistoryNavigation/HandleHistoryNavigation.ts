import type { HandleHistoryNavigationParams } from "./HandleHistoryNavigation-types";

export const handleHistoryNavigation = ({
	richTextEditorUI,
	editorAPI,
}: HandleHistoryNavigationParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = richTextEditorUI.onHistoryNavigation(({ type }) => {
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
