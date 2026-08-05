import { createAnchoredOverlayController } from "../../_Utilities";
import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleBeforeSelect } from "./HandleBeforeSelect";
import { handleOverlayAppearance } from "./HandleOverlayAppearance";
import { handleOverlayClose } from "./HandleOverlayClose";

export const configureCommandMenu = ({
	editorPort,
	editorAPI,
}: ConfigureCommandMenuParams) => {
	const anchorController = createAnchoredOverlayController({
		element: editorPort.anchoredOverlay,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
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

	const beforeSelectCleanup = handleBeforeSelect({
		editorPort,
		editorAPI,
	});

	return () => {
		overlayCloseCleanup();
		overlayAppearanceCleanup();
		beforeSelectCleanup();
	};
};
