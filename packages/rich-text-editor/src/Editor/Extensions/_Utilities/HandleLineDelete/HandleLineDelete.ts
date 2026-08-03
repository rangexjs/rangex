import type { HandleLineDeleteParams } from "./HandleLineDelete-types";

/**
 * Deletes the `Line` `getCurrentLine` currently resolves to, regardless of whether it's a
 * `ContentLine` or a `BlockNestedContextLine` — both are removed the same way, by clearing
 * their full child range. This is the line-level counterpart to `HandleBlockDelete`, which
 * only knows how to delete a `BlockNestedContext`'s own line; once every block-level popover
 * (Image, Video, ...) delegates deletion to `LineHandler` instead of its own Delete button,
 * `HandleBlockDelete` goes away in favor of this.
 */
export const handleLineDelete = ({
	port,
	editorAPI,
	getCurrentLine,
}: HandleLineDeleteParams) => {
	const selection = editorAPI.getEditorSelection();
	const unsubscribeDelete = port.onDelete(() => {
		const currentLine = getCurrentLine();

		if (!currentLine) {
			return;
		}

		const { $$previousSibling, $$nextSibling } = currentLine;

		if ($$previousSibling) {
			currentLine.$$remove();

			selection.setBoundaryPoints({
				fromNode: $$previousSibling,
				fromOffset: $$previousSibling.$$childNodes.length,
				toNode: $$previousSibling,
				toOffset: $$previousSibling.$$childNodes.length,
			});
		} else if ($$nextSibling) {
			currentLine.$$remove();

			selection.setBoundaryPoints({
				fromNode: $$nextSibling,
				fromOffset: 0,
				toNode: $$nextSibling,
				toOffset: 0,
			});
		} else {
			editorAPI.removeNodesInRange({
				fromNode: currentLine,
				fromOffset: 0,
				toNode: currentLine,
				toOffset: currentLine.$$childNodes.length,
			});
		}

		const snapshotTimeline = editorAPI.getSnapshotTimeline();
		snapshotTimeline.registerSnapshotBoundary();
		editorAPI.focus();
	});

	return () => {
		unsubscribeDelete();
	};
};
