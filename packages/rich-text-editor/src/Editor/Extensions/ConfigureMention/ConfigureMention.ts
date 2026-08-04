import { createAnchoredOverlayController } from "../../_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionInsertion } from "./HandleMentionInsertion";
import { handleOverlayAppearance } from "./HandleOverlayAppearance";
import { handleOverlayClose } from "./HandleOverlayClose";
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

	// handleOverlayClose must be subscribed before handleOverlayAppearance — both listen to
	// editorSelectionChangeEventType, and close must fire first to hide before appearance re-evaluates.
	const overlayCloseCleanup = handleOverlayClose({
		editorAPI,
		anchorController,
	});

	const overlayAppearanceCleanup = handleOverlayAppearance({
		editorPort,
		editorAPI,
		anchorController,
	});

	return () => {
		editorPort.anchoredOverlay.unmount();

		mentionInsertionCleanup();
		overlayCloseCleanup();
		overlayAppearanceCleanup();
	};
};
