import type { HandleFindReplaceActivationParams } from "./HandleFindReplaceActivation-types";

/** Ties find-replace engine activation to the popover lifecycle, seeding criteria on open. */
export const handleFindReplaceActivation = ({
	editorPort,
	editorAPI,
}: HandleFindReplaceActivationParams) => {
	const findReplace = editorAPI.getFindReplace();

	const openCleanup = editorPort.onPopoverOpen(
		({ pattern, includeNonEditableContent }) => {
			findReplace.enable();

			findReplace.setCriteria({
				pattern,
				nonEditableIncluded: includeNonEditableContent,
			});
		},
	);

	const closedCleanup = editorPort.onPopoverClosed(() => {
		findReplace.disable();
	});

	return () => {
		openCleanup();
		closedCleanup();
	};
};
