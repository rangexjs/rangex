import type { ConfigureEmojiParams } from "./ConfigureEmoji-types";
import { handleEmojiAutoComplete } from "./HandleEmojiAutoComplete";
import { handleEmojiInsertion } from "./HandleEmojiInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";

export const configureEmoji = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureEmojiParams) => {
	const emojiInsertionCleanup = handleEmojiInsertion({
		richTextEditorUI,
		editorAPI,
	});

	// Subscription order matters — all three listen to editorSelectionChangeEventType:
	// 1. close   — hides the popover before anything else re-evaluates
	// 2. autoComplete — inserts emoji for a completed :<name>: shortcode
	// 3. appearance  — shows the popover for a partial :query
	const popoverCloseCleanup = handlePopoverClose({
		richTextEditorUI,
		editorAPI,
	});
	const emojiAutoCompleteCleanup = handleEmojiAutoComplete({
		richTextEditorUI,
		editorAPI,
	});
	const popoverAppearanceCleanup = handlePopoverAppearance({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		emojiInsertionCleanup();
		popoverCloseCleanup();
		emojiAutoCompleteCleanup();
		popoverAppearanceCleanup();
	};
};
