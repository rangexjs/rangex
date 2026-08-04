import { createAnchoredOverlayController } from "../../_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionInsertion } from "./HandleMentionInsertion";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";
import { loadMentionItems } from "./LoadMentionItems";

export const configureMention = ({
	editorPort,
	editorAPI,
}: ConfigureMentionParams) => {
	editorPort.anchoredOverlay.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay.element,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
	});

	loadMentionItems({ editorPort });

	const mentionInsertionCleanup = handleMentionInsertion({
		editorPort,
		editorAPI,
	});

	// handlePopoverClose must be subscribed before handlePopoverAppearance — both listen to
	// editorSelectionChangeEventType, and close must fire first to hide before appearance re-evaluates.
	const popoverCloseCleanup = handlePopoverClose({
		editorAPI,
		anchorController,
	});

	const popoverAppearanceCleanup = handlePopoverAppearance({
		editorPort,
		editorAPI,
		anchorController,
	});

	return () => {
		editorPort.anchoredOverlay.unmount();

		mentionInsertionCleanup();
		popoverCloseCleanup();
		popoverAppearanceCleanup();
	};
};
