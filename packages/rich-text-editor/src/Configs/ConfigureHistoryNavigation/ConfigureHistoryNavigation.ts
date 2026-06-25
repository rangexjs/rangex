import type { ConfigureHistoryNavigationParams } from "./ConfigureHistoryNavigation-types";
import { handleHistoryNavigation } from "./HandleHistoryNavigation";
import { handleHistoryNavigationButtonState } from "./HandleHistoryNavigationButtonState";

export const configureHistoryNavigation = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureHistoryNavigationParams) => {
	const historyNavigationCleanup = handleHistoryNavigation({
		richTextEditorUI,
		editorAPI,
	});

	const buttonStateCleanup = handleHistoryNavigationButtonState({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		historyNavigationCleanup();
		buttonStateCleanup();
	};
};
