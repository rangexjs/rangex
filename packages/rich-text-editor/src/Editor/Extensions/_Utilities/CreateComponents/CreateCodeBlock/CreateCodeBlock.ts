import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createDetachedContext,
	createHTMLLayout,
	createList,
} from "rich-text-area";
import { componentsName } from "../../../../Constants";
import { toHighlighterLang } from "../../../../Libs/SyntaxHighlighter";
import { createCodeBlockStorage } from "../../../../Storage";
import type {
	CreateCodeBlockParams,
	CreateCodeBlockResult,
} from "./CreateCodeBlock-types";

export const createCodeBlock = ({
	language,
	childNodes,
}: CreateCodeBlockParams): CreateCodeBlockResult => {
	const list = createList({
		localName: "ol",
		lineType: "single-line",
		itemsChildNodes: childNodes?.map((line) => [line]),
		createPreLayout: ({ nestedEditable }) => [
			createHTMLLayout({
				localName: "div",
				childNodes: [
					createDetachedContext({
						localName: "span",
						shadowTree: [document.createTextNode("0")],
					}),
					nestedEditable({
						allowedComponents: [],
						allowedContentLineLocalNames: [],
						allowedContentLineStyleAttrNames: [],
						allowedGlyphFormatterInlineTags: [],
						allowedGlyphFormatterStyleAttrNames: [],
					}),
				],
			}),
		],
	});

	return createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.codeBlock,
			content: { type: "list" },
			customStorage: createCodeBlockStorage({
				lang: toHighlighterLang(language) ?? "typescript",
				theme: { light: "light-plus", dark: "dark-plus" },
			}),
			childNodes: [
				createHTMLLayout({
					localName: "pre",
					childNodes: [
						createHTMLLayout({
							localName: "code",
							childNodes: [list],
						}),
					],
				}),
			],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};
