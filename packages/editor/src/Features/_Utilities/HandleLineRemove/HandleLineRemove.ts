import type { HandleLineRemoveParams } from "./HandleLineRemove-types";

/*
 * Wires a remove control to the engine, removing the current line and moving the selection
 * to a sibling line, or clearing its content if it has no siblings.
 */
export const handleLineRemove = ({ port, editorAPI, getCurrentLine }: HandleLineRemoveParams) => {
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
