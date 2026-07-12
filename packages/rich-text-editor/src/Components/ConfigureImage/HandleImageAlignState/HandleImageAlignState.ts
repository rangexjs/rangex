import { setBlockAlign } from "../../_Utilities";
import type { HandleImageAlignStateParams } from "./HandleImageAlignState-types";

/**
 * Wires the popover's alignment control to the engine. Reads the active image from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleImageAlignState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleImageAlignStateParams) => {
	const { imageEditPopover } = richTextEditorUI;

	const unsubscribeAlignChange = imageEditPopover.onAlignChange((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		imageEditPopover.updateState({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
