import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionInsertion } from "./HandleMentionInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";
import { loadMentionItems } from "./LoadMentionItems";

export const configureMention = ({
	mentionPort,
	editorAPI,
}: ConfigureMentionParams) => {
	loadMentionItems({ mentionPort });

	const mentionInsertionCleanup = handleMentionInsertion({
		mentionPort,
		editorAPI,
	});

	// handlePopoverClose must be subscribed before handlePopoverAppearance — both listen to
	// editorSelectionChangeEventType, and close must fire first to hide before appearance re-evaluates.
	const popoverCloseCleanup = handlePopoverClose({
		mentionPort,
		editorAPI,
	});

	const popoverAppearanceCleanup = handlePopoverAppearance({
		mentionPort,
		editorAPI,
	});

	return () => {
		mentionInsertionCleanup();
		popoverCloseCleanup();
		popoverAppearanceCleanup();
	};
};
