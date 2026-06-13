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
	handleFindReplaceActivation({ richTextEditorUI, editorAPI });

	handleSearchChange({ richTextEditorUI, editorAPI });

	handleResultsSync({ richTextEditorUI, editorAPI });

	handleStepChange({ richTextEditorUI, editorAPI });

	handleReplacement({ richTextEditorUI, editorAPI });

	handleNavigateToIndex({ richTextEditorUI, editorAPI });
};
