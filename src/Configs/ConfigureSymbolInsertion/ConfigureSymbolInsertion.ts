import { createContentLine, createFormattableTexts } from "rich-text-area";
import type { ConfigureSymbolInsertionParams } from "./ConfigureSymbolInsertion-types";

export const configureSymbolInsertion = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureSymbolInsertionParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "symbols") {
			return;
		}

		const { data } = params;

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
					childNodes: [...createFormattableTexts({ data })],
				}),
			],
			breakBeforeInsert: false,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});
};
