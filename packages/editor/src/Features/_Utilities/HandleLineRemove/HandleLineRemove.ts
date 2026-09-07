import type { HandleLineRemoveParams } from "./HandleLineRemove-types";

/**
 * Removes the `Line` `getCurrentLine` currently resolves to, regardless of whether it's a
 * `ContentLine` or a `BlockComponentLine` — both are removed the same way, by clearing
 * their full child range. This is the line-level counterpart to `HandleBlockRemove`, which
 * only knows how to remove a `BlockComponent`'s own line; once every block-level popover
 * (Image, Video, ...) delegates removal to `LineHandler` instead of its own Remove button,
 * `HandleBlockRemove` goes away in favor of this.
 */
export const handleLineRemove = ({
	port,
	editorAPI,
	getCurrentLine,
}: HandleLineRemoveParams) => {
	const selection = editorAPI.getEditorSelection();
	const unsubscribeRemove = port.onRemove(() => {
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
		unsubscribeRemove();
	};
};
