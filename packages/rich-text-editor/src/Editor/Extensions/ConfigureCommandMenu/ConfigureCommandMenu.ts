import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleBeforeSelect } from "./HandleBeforeSelect";
import { handlePopoverAppearance } from "./HandlePopoverAppearance";
import { handlePopoverClose } from "./HandlePopoverClose";

export const configureCommandMenu = ({
	editorPort,
	editorAPI,
}: ConfigureCommandMenuParams) => {
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
