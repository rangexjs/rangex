import { setBlockAlign } from "../BlockAlign";
import type { HandleBlockAlignStateParams } from "./HandleBlockAlignState-types";

/**
 * Wires a popover's alignment control to the engine. Reads the active block from the shared
 * {@link BlockPopoverAppearanceHandler} — set whenever the popover opens over a new block.
 */
export const handleBlockAlignState = ({
	port,
	editorAPI,
	getCurrentBlock,
}: HandleBlockAlignStateParams) => {
	const unsubscribeAlignChange = port.onAlignChange((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockNestedContextLine: $$parentElement, align });
		port.setAlign(align);

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
