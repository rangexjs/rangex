import { createTable } from "../../_Utilities";
import type { HandleTableInsertionParams } from "./HandleTableInsertion-types";

export const handleTableInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTableInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(({ row, column }) => {
		const table = createTable({ rows: row, cols: column });

		blockComponentPlacement.insertBySelection({
			lines: [table],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: table,
			fromOffset: table.childNodes.length,
			toNode: table,
			toOffset: table.childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
