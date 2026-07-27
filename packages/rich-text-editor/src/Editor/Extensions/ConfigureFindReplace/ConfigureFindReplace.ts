import type { ConfigureFindReplaceParams } from "./ConfigureFindReplace-types";
import { handleFindReplaceActivation } from "./HandleFindReplaceActivation";
import { handleNavigateToIndex } from "./HandleNavigateToIndex";
import { handleReplacement } from "./HandleReplacement";
import { handleResultsSync } from "./HandleResultsSync";
import { handleSearchChange } from "./HandleSearchChange";
import { handleStepChange } from "./HandleStepChange";

/** Registers all find-replace event handlers between the UI and the editor engine. */
export const configureFindReplace = ({
	editorPort,
	editorAPI,
}: ConfigureFindReplaceParams) => {
	const activationCleanup = handleFindReplaceActivation({
		editorPort,
		editorAPI,
	});
	const searchChangeCleanup = handleSearchChange({ editorPort, editorAPI });
	const resultsSyncCleanup = handleResultsSync({ editorPort, editorAPI });
	const stepChangeCleanup = handleStepChange({ editorPort, editorAPI });
	const replacementCleanup = handleReplacement({ editorPort, editorAPI });
	const navigateToIndexCleanup = handleNavigateToIndex({
		editorPort,
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
