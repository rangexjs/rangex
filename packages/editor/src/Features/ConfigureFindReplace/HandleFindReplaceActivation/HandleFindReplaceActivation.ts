import type { HandleFindReplaceActivationParams } from "./HandleFindReplaceActivation-types";

/*
 * Ties find-replace engine activation to the popover lifecycle, seeding criteria on open.
 */
export const handleFindReplaceActivation = ({
	configPort,
	editorAPI,
}: HandleFindReplaceActivationParams) => {
	const findReplace = editorAPI.getFindReplace();

	const openCleanup = configPort.onOpen(({ pattern, includeNonEditableContent }) => {
		findReplace.enable();

		findReplace.setCriteria({
			pattern,
			nonEditableIncluded: includeNonEditableContent,
		});
	});

	const closedCleanup = configPort.onClose(() => {
		findReplace.disable();
	});

	return () => {
		openCleanup();
		closedCleanup();
	};
};
