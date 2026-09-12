import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
	createNestedEditable,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createBlockQuoteStorage,
} from "#engine-links";
import type {
	CreateBlockQuoteParams,
	CreateBlockQuoteResult,
} from "./CreateBlockQuote-types";

/*
 * Builds a block quote component wrapping a `blockquote` element with an editable text area.
 */
export const createBlockQuote = ({
	childNodes,
}: CreateBlockQuoteParams): CreateBlockQuoteResult => {
	const nestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block multi-line",
		childNodes,
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
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
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
