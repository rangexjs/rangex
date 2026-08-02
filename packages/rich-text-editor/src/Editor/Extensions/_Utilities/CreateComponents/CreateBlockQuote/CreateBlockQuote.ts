import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../../Constants";
import { createBlockQuoteStorage } from "../../../../Storage";
import type {
	CreateBlockQuoteParams,
	CreateBlockQuoteResult,
} from "./CreateBlockQuote-types";

export const createBlockQuote = ({
	childNodes,
}: CreateBlockQuoteParams): CreateBlockQuoteResult => {
	const nestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block multi-line",
		childNodes,
	});

	return createBlockNestedContextLine({
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
};
