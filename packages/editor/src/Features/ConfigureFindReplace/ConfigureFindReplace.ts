import type { ConfigureFindReplaceParams } from "./ConfigureFindReplace-types";
import { handleFindReplaceActivation } from "./HandleFindReplaceActivation";
import { handleNavigateToIndex } from "./HandleNavigateToIndex";
import { handleReplacement } from "./HandleReplacement";
import { handleResultsSync } from "./HandleResultsSync";
import { handleSearchChange } from "./HandleSearchChange";
import { handleStepChange } from "./HandleStepChange";

/*
 * Registers all find-replace event handlers between the UI and the editor engine.
 */
export const configureFindReplace = ({
	configPort,
	editorAPI,
}: ConfigureFindReplaceParams) => {
	const activationCleanup = handleFindReplaceActivation({
		configPort,
		editorAPI,
	});
	const searchChangeCleanup = handleSearchChange({ configPort, editorAPI });
	const resultsSyncCleanup = handleResultsSync({ configPort, editorAPI });
	const stepChangeCleanup = handleStepChange({ configPort, editorAPI });
	const replacementCleanup = handleReplacement({ configPort, editorAPI });
	const navigateToIndexCleanup = handleNavigateToIndex({
		configPort,
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
