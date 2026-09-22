import { setBlockAlign } from "../BlockAlign";
import type { HandleBlockAlignStateParams } from "./HandleBlockAlignState-types";

/*
 * Wires a popover's alignment control to the engine, applying alignment changes to the
 * active block and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleBlockAlignState = ({
	port,
	editorAPI,
	getCurrentBlock,
}: HandleBlockAlignStateParams) => {
	const unsubscribeAlignChange = port.onChangeAlign((align) => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		setBlockAlign({ blockComponentLine: $$parentElement, align });
		port.updateBlockAlign({ align });

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeAlignChange();
	};
};
