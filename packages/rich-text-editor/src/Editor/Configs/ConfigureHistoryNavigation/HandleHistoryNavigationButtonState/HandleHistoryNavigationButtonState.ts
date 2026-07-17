import { snapshotIndexChangeEventType } from "rich-text-area";
import type { HandleHistoryNavigationButtonStateParams } from "./HandleHistoryNavigationButtonState-types";

export const handleHistoryNavigationButtonState = ({
	richTextEditorUI,
	editorAPI,
}: HandleHistoryNavigationButtonStateParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			richTextEditorUI.updateHistoryNavigationButtonState({
				historyBack: { disabled: !snapshotTimeline.canStepBack },
				historyForward: { disabled: !snapshotTimeline.canStepForward },
			});
		},
	});

	return () => {
		unsubscribe();
	};
};
