import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createTable,
} from "rich-text-area";
import { getCSSText } from "../../../_Utilities";
import { componentsName } from "../../../Constants";
import type {
	CreateTableComponentParams,
	CreateTableComponentResult,
	HandleTableInsertionParams,
} from "./HandleTableInsertion-types";

const createTableComponent = ({
	rows,
	cols,
}: CreateTableComponentParams): CreateTableComponentResult => {
	const table = createTable({
		rows,
		cols,
		domAttrs: {
			style: getCSSText({
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "grey",
			}),
		},
		cellDOMAttrs: {
			style: getCSSText({
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "grey",
			}),
		},
	});

	const blockNestedContextLine = createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.table,
			content: { type: "custom" },
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [table],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const handleTableInsertion = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleTableInsertionParams) => {
	richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "table") {
			return;
		}

		const { row, column } = params;

		const table = createTableComponent({ rows: row, cols: column });

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
};
