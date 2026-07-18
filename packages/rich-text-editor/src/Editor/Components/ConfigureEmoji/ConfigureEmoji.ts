import type { ConfigureEmojiParams } from "./ConfigureEmoji-types";
import { handleEmojiAutoComplete } from "./HandleEmojiAutoComplete";
import { handleEmojiInsertion } from "./HandleEmojiInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";

export const configureEmoji = ({
	emojiPort,
	editorAPI,
}: ConfigureEmojiParams) => {
	const emojiInsertionCleanup = handleEmojiInsertion({
		emojiPort,
		editorAPI,
	});

	// Subscription order matters — all three listen to editorSelectionChangeEventType:
	// 1. close   — hides the popover before anything else re-evaluates
	// 2. autoComplete — inserts emoji for a completed :<name>: shortcode
	// 3. appearance  — shows the popover for a partial :query
	const popoverCloseCleanup = handlePopoverClose({
		emojiPort,
		editorAPI,
	});

	const emojiAutoCompleteCleanup = handleEmojiAutoComplete({
		emojiPort,
		editorAPI,
	});

	const popoverAppearanceCleanup = handlePopoverAppearance({
		emojiPort,
		editorAPI,
	});

	return () => {
		emojiInsertionCleanup();
		popoverCloseCleanup();
		emojiAutoCompleteCleanup();
		popoverAppearanceCleanup();
	};
};
