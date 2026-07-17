import type { HandleVideoDeleteParams } from "./HandleVideoDelete-types";

/**
 * Wires the popover's Delete control to the engine. Fires immediately, no confirmation —
 * undo (`registerSnapshotBoundary`) is the safety net, consistent with the rest of the editor.
 */
export const handleVideoDelete = ({
	richTextEditorUI,
	editorAPI,
	getCurrentBlock,
}: HandleVideoDeleteParams) => {
	const { videoPopover } = richTextEditorUI;

	const unsubscribeDelete = videoPopover.onDelete(() => {
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
		unsubscribeDelete();
	};
};
