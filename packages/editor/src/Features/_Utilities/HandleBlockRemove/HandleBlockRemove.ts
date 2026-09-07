import type { HandleBlockRemoveParams } from "./HandleBlockRemove-types";

/**
 * Wires a popover's Remove control to the engine. Fires immediately, no confirmation —
 * undo (`registerSnapshotBoundary`) is the safety net, consistent with the rest of the editor.
 */
export const handleBlockRemove = ({
	port,
	editorAPI,
	getCurrentBlock,
}: HandleBlockRemoveParams) => {
	const unsubscribeRemove = port.onRemove(() => {
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

		editorAPI.focus();
	});

	return () => {
		unsubscribeRemove();
	};
};
