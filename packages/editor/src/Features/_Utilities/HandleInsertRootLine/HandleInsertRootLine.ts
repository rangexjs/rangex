import { createBeamText, createContentLine } from "@rangex/core";

import type { HandleInsertRootLineParams } from "./HandleInsertRootLine-types";

/*
 * Wires an insert control to the engine, inserting a blank paragraph line above or below
 * the current line and moving the selection into it.
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
