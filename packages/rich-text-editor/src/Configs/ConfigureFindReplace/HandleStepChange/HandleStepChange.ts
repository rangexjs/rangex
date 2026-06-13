import type { HandleStepChangeParams } from "./HandleStepChange-types";

/** Steps forward or backward through matches in response to navigation actions. */
export const handleStepChange = ({
	richTextEditorUI,
	editorAPI,
}: HandleStepChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action } = params;

		if (action === "previous") {
			findReplace.stepBack();
		}

		if (action === "next") {
			findReplace.stepForward();
		}
	});
};
