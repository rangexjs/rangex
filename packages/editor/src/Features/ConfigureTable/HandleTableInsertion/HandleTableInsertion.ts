import { createTable, validateTablePlacement } from "../../_Utilities";
import type { HandleTableInsertionParams } from "./HandleTableInsertion-types";

/*
 * Inserts a new table at the current selection on insert requests, then places the
 * selection inside it and focuses the editor. A size past the table's limits is ignored.
 */
export const handleTableInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTableInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onInsert(({ row, column }) => {
		const placementMismatch = validateTablePlacement({
			row,
			column,
			limits: configPort.limits,
		});

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

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
