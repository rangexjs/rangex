import { snapshotIndexChangeEventType } from "rich-text-area";
import type { ConfigureHistoryNavigationParams } from "./ConfigureHistoryNavigation-types";

export const configureHistoryNavigation = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureHistoryNavigationParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribeHistoryNavigation = richTextEditorUI.onHistoryNavigation(
		({ type }) => {
			if (type === "history-back") {
				snapshotTimeline.stepBack();
			}

			if (type === "history-forward") {
				snapshotTimeline.stepForward();
			}

			editorAPI.focus();
		},
	);

	const unsubscribeSnapshotIndex = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			richTextEditorUI.updateHistoryNavigationButtonState({
				historyBack: { disabled: !snapshotTimeline.canStepBack },
				historyForward: { disabled: !snapshotTimeline.canStepForward },
			});
		},
	});

	return () => {
		unsubscribeHistoryNavigation();
		unsubscribeSnapshotIndex();
	};
};
