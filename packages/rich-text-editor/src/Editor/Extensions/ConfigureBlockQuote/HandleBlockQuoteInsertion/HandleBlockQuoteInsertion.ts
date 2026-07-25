import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createNestedEditable,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { createBlockQuoteStorage } from "../BlockQuoteStorage";
import type {
	CreateBlockQuoteLineResult,
	HandleBlockQuoteInsertionParams,
} from "./HandleBlockQuoteInsertion-types";

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
			customStorage: createBlockQuoteStorage(),
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

export const handleBlockQuoteInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuoteInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
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

	return () => {
		unsubscribe();
	};
};
