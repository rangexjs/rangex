import { scrollMatchedRangeIntoView } from "../_Utilities";
import type { HandleStepChangeParams } from "./HandleStepChange-types";

/*
 * Steps forward or backward through matches in response to navigation actions.
 */
export const handleStepChange = ({ configPort, editorAPI }: HandleStepChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	const stepBackCleanup = configPort.onStepBack(() => {
		findReplace.stepBack();

		scrollMatchedRangeIntoView({ findReplace });
	});

	const stepForwardCleanup = configPort.onStepForward(() => {
		findReplace.stepForward();

		scrollMatchedRangeIntoView({ findReplace });
	});

	return () => {
		stepBackCleanup();
		stepForwardCleanup();
	};
};
