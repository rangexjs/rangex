import type { HandleSwapToEmptyMediaParams } from "./HandleSwapToEmptyMedia-types";

export const handleSwapToEmptyMedia = ({
	port,
	editorAPI,
	getCurrentBlock,
}: HandleSwapToEmptyMediaParams) => {
	const unsubscribeSwap = port.onSwap(() => {
		if (!port.canSwap) {
			return;
		}

		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const { $$parentElement } = currentBlock;

		if (!$$parentElement) {
			throw new Error("ParentElement not supposed to be null.");
		}

		editorAPI.removeNodesInRange({
			fromNode: $$parentElement,
			fromOffset: 0,
			toNode: $$parentElement,
			toOffset: $$parentElement.$$childNodes.length,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		port.emitSwapToEmptyMedia();
	});

	return () => {
		unsubscribeSwap();
	};
};
