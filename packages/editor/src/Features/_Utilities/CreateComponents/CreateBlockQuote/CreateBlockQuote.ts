import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
	createNestedEditable,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#engine-links";
import { createBlockQuoteStorage } from "#storage";
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
			name: componentsName.blockQuote,
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
