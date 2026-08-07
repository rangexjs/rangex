import { createBeamText, createContentLine } from "rich-text-area";
import type { HandleInsertRootLineParams } from "./HandleInsertRootLine-types";

/**
 * Inserts a blank paragraph line above or below the `Line` `getCurrentLine` resolves to.
 * `insertNode` accepts the `Line` node directly as `fromNode` — offset `0` for "above",
 * the line's own child count for "below".
 */
export const handleInsertRootLine = ({
	port,
	editorAPI,
	getCurrentLine,
}: HandleInsertRootLineParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = port.onInsertRootLine((position) => {
		const currentLine = getCurrentLine();

		if (!currentLine) {
			return;
		}

		const contentLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText({})],
		});

		({
			above: () => currentLine.$$before(contentLine),
			below: () => currentLine.$$after(contentLine),
		})[position]();

		selection.setBoundaryPoints({
			fromNode: contentLine,
			fromOffset: 0,
			toNode: contentLine,
			toOffset: 0,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();
		snapshotTimeline.registerSnapshotBoundary();
		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
