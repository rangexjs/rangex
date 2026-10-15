import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
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
 * Builds a block quote component wrapping a `blockquote` element with an editable text area,
 * holding the given child lines or a single empty one.
 */
export const createBlockQuote = ({
	childNodes = [
		createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
	],
}: CreateBlockQuoteParams): CreateBlockQuoteResult => {
	const nestedEditable = createNestedEditable({
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: null,
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
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
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			editState: "inherit",
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
