import { scrollMatchedRangeIntoView } from "../_Utilities";
import type { HandleStepChangeParams } from "./HandleStepChange-types";

/** Steps forward or backward through matches in response to navigation actions. */
export const handleStepChange = ({
	editorPort,
	editorAPI,
}: HandleStepChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	const stepBackCleanup = editorPort.onStepBack(() => {
		findReplace.stepBack();

		scrollMatchedRangeIntoView({ findReplace });
	});

	const stepForwardCleanup = editorPort.onStepForward(() => {
		findReplace.stepForward();

		scrollMatchedRangeIntoView({ findReplace });
	});

	return () => {
		stepBackCleanup();
		stepForwardCleanup();
	};
};
