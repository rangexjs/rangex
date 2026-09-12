import { createContentLine, createFormattableTexts } from "rich-text-area";
import type { HandleSymbolsInsertionParams } from "./HandleSymbolsInsertion-types";

/*
 * Listens for symbol insert requests and inserts the requested symbol text at the current
 * selection's leading edge (following DOM direction), then refocuses the editor.
 */
export const handleSymbolsInsertion = ({
	configPort,
	editorAPI,
}: HandleSymbolsInsertionParams) => {
	const selection = editorAPI.getEditorSelection();
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = configPort.onInsert((data) => {
		const { fromText, fromOffset, toText, toOffset } =
			selection.getBoundaryPoints();
		const { domDirection } = selection;

		const { text, offset } = {
			forward: { text: toText, offset: toOffset },
			backward: { text: fromText, offset: fromOffset },
			none: { text: toText, offset: toOffset },
		}[domDirection];

		editorAPI.insertNode({
			fromNode: text,
			fromOffset: offset,
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
