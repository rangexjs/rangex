import type { ConfigureFindReplaceParams } from "./ConfigureFindReplace-types";
import { handleFindReplaceActivation } from "./HandleFindReplaceActivation";
import { handleNavigateToIndex } from "./HandleNavigateToIndex";
import { handleReplacement } from "./HandleReplacement";
import { handleResultsSync } from "./HandleResultsSync";
import { handleSearchChange } from "./HandleSearchChange";
import { handleStepChange } from "./HandleStepChange";

/** Registers all find-replace event handlers between the UI and the editor engine. */
export const configureFindReplace = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureFindReplaceParams) => {
	const activationCleanup = handleFindReplaceActivation({
		richTextEditorUI,
		editorAPI,
	});
	const searchChangeCleanup = handleSearchChange({
		richTextEditorUI,
		editorAPI,
	});
	const resultsSyncCleanup = handleResultsSync({ richTextEditorUI, editorAPI });
	const stepChangeCleanup = handleStepChange({ richTextEditorUI, editorAPI });
	const replacementCleanup = handleReplacement({ richTextEditorUI, editorAPI });
	const navigateToIndexCleanup = handleNavigateToIndex({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		activationCleanup();
		searchChangeCleanup();
		resultsSyncCleanup();
		stepChangeCleanup();
		replacementCleanup();
		navigateToIndexCleanup();
	};
};
