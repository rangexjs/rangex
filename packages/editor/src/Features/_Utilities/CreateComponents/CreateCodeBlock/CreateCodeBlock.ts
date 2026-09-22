import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createDetachedContext,
	createHTMLLayout,
	createList,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createCodeBlockStorage,
} from "#engine-links";
import type {
	CreateCodeBlockParams,
	CreateCodeBlockResult,
} from "./CreateCodeBlock-types";

/*
 * Builds a code block component: a `pre`/`code` element containing a numbered line list,
 * with syntax highlighting configured from the given language and light/dark themes.
 */
export const createCodeBlock = ({
	language,
	theme,
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

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.codeBlock,
			content: { type: "list" },
			customStorage: createCodeBlockStorage({ language, theme }),
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
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
