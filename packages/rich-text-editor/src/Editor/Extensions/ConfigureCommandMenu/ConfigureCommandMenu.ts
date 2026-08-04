import { createAnchoredOverlayController } from "../../_Utilities";
import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleBeforeSelect } from "./HandleBeforeSelect";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";

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

	const beforeSelectCleanup = handleBeforeSelect({
		editorPort,
		editorAPI,
	});

	return () => {
		popoverCloseCleanup();
		popoverAppearanceCleanup();
		beforeSelectCleanup();
	};
};
