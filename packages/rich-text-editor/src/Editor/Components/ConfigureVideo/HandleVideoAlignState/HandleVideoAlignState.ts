import { setBlockAlign } from "../../_Utilities";
import type { HandleVideoAlignStateParams } from "./HandleVideoAlignState-types";

/**
 * Wires the popover's alignment control to the engine. Reads the active video from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleVideoAlignState = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoAlignStateParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeAlignChange = videoPopover.onAlignChange((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		videoPopover.updateState({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
