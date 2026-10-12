import { createContentLine, createFormattableTexts } from "@rangex/core";
import type { HandleSymbolsInsertionParams } from "./HandleSymbolsInsertion-types";

/*
 * Listens for symbol insert requests and inserts the requested symbol text at the current
 * selection's end (the later boundary point in the DOM), then refocuses the editor.
 */
export const handleSymbolsInsertion = ({
	configPort,
	editorAPI,
}: HandleSymbolsInsertionParams) => {
	const selection = editorAPI.getEditorSelection();
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = configPort.onInsert((data) => {
		const { toText, toOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: toText,
			fromOffset: toOffset,
			lines: [
				createContentLine({
					localName: "p",
					childNodes: [...createFormattableTexts({ data })],
				}),
			],
			breakBeforeInsert: false,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
