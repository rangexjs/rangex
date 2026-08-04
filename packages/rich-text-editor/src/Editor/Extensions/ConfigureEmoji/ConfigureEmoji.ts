import { createAnchoredOverlayController } from "../../_Utilities";
import type { ConfigureEmojiParams } from "./ConfigureEmoji-types";
import { handleEmojiAutoComplete } from "./HandleEmojiAutoComplete";
import { handleEmojiInsertion } from "./HandleEmojiInsertion";
import { handleOverlayAppearance } from "./HandleOverlayAppearance";
import { handleOverlayClose } from "./HandleOverlayClose";

export const configureEmoji = ({
	editorPort,
	editorAPI,
}: ConfigureEmojiParams) => {
	editorPort.anchoredOverlay.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay.element,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
	});

	const emojiInsertionCleanup = handleEmojiInsertion({
		editorPort,
		editorAPI,
	});

	// Subscription order matters — all three listen to editorSelectionChangeEventType:
	// 1. close   — hides the popover before anything else re-evaluates
	// 2. autoComplete — inserts emoji for a completed :<name>: shortcode
	// 3. appearance  — shows the popover for a partial :query
	const overlayCloseCleanup = handleOverlayClose({
		editorAPI,
		anchorController,
	});

	const emojiAutoCompleteCleanup = handleEmojiAutoComplete({
		editorPort,
		editorAPI,
	});

	const overlayAppearanceCleanup = handleOverlayAppearance({
		editorPort,
		editorAPI,
		anchorController,
	});

	return () => {
		editorPort.anchoredOverlay.unmount();

		emojiInsertionCleanup();
		overlayCloseCleanup();
		emojiAutoCompleteCleanup();
		overlayAppearanceCleanup();
	};
};
