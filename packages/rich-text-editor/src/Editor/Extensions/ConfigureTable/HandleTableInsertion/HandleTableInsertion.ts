import { createTable } from "../../_Utilities";
import type { HandleTableInsertionParams } from "./HandleTableInsertion-types";

export const handleTableInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTableInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onInsertRequest(({ row, column }) => {
		const table = createTable({ rows: row, cols: column });

		blockComponentPlacement.insertBySelection({
			lines: [table],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: table,
			fromOffset: table.$$childNodes.length,
			toNode: table,
			toOffset: table.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
