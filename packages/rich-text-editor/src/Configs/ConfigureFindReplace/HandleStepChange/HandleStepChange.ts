import { scrollMatchedRangeIntoView } from "../_Utilities";
import type { HandleStepChangeParams } from "./HandleStepChange-types";

/** Steps forward or backward through matches in response to navigation actions. */
export const handleStepChange = ({
	richTextEditorUI,
	editorAPI,
}: HandleStepChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action } = params;

		if (action !== "previous" && action !== "next") {
			return;
		}

		if (action === "previous") {
			findReplace.stepBack();
		}

		if (action === "next") {
			findReplace.stepForward();
		}

		scrollMatchedRangeIntoView({ findReplace });
	});

	return () => {
		unsubscribe();
	};
};
