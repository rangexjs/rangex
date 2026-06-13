import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createNestedEditable,
	editorSelectionChangeEventType,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../Constants";
import type {
	ConfigureBlockQuoteParams,
	CreateBlockQuoteLineResult,
} from "./ConfigureBlockQuote-types";

const createBlockQuoteLine = (): CreateBlockQuoteLineResult => {
	const nestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block multi-line",
	});

	const blockNestedContextLine = createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.blockQuote,
			content: { type: "styled-block" },
			childNodes: [
				createHTMLLayout({
					localName: "blockquote",
					childNodes: [nestedEditable],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const configureBlockQuote = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureBlockQuoteParams) => {
	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.blockQuote],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				table: { disabled: !canWrap },
			});
		},
	});

	richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "block-quote") {
			return;
		}

		const blockQuoteLine = createBlockQuoteLine();

		const nestedEditable = blockQuoteLine.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableName) {
			throw new Error("NestedEditable's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockNestedContextLine: blockQuoteLine,
			target: nestedEditable,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: nestedEditable,
			fromOffset: nestedEditable.childNodes.length,
			toNode: nestedEditable,
			toOffset: nestedEditable.childNodes.length,
		});

		editorAPI.focus();
	});
};
