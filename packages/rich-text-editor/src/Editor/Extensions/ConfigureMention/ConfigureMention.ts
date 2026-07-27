import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionInsertion } from "./HandleMentionInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";
import { loadMentionItems } from "./LoadMentionItems";

export const configureMention = ({
	editorPort,
	editorAPI,
}: ConfigureMentionParams) => {
	loadMentionItems({ editorPort });

	const mentionInsertionCleanup = handleMentionInsertion({
		editorPort,
		editorAPI,
	});

	// handlePopoverClose must be subscribed before handlePopoverAppearance — both listen to
	// editorSelectionChangeEventType, and close must fire first to hide before appearance re-evaluates.
	const popoverCloseCleanup = handlePopoverClose({
		editorPort,
		editorAPI,
	});

	const popoverAppearanceCleanup = handlePopoverAppearance({
		editorPort,
		editorAPI,
	});

	return () => {
		mentionInsertionCleanup();
		popoverCloseCleanup();
		popoverAppearanceCleanup();
	};
};
