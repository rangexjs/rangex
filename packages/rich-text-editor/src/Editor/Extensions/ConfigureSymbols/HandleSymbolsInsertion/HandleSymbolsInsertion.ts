import { createContentLine, createFormattableTexts } from "rich-text-area";
import type { HandleSymbolsInsertionParams } from "./HandleSymbolsInsertion-types";

export const handleSymbolsInsertion = ({
	editorPort,
	editorAPI,
}: HandleSymbolsInsertionParams) => {
	const selection = editorAPI.getEditorSelection();
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorPort.onInsertRequest(({ data }) => {
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
