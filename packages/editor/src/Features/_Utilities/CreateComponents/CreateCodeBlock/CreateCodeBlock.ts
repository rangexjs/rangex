import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createDetachedContext,
	createHTMLLayout,
	createList,
	createListItem,
	createNestedEditable,
} from "@rangex/core";

import { codeBlockDefinition, componentsName } from "#constants";
import { createCodeBlockStorage } from "#storage";

import type { CreateCodeBlockParams, CreateCodeBlockResult } from "./CreateCodeBlock-types";

/*
 * Builds a code block component: a `pre`/`code` element containing a numbered line list
 * (one item per given child line, or a single empty one), with syntax highlighting
 * configured from the given language and light/dark themes.
 */
export const createCodeBlock = ({
	language,
	theme,
	childNodes = [createContentLine({ localName: "p", childNodes: [createBeamText({})] })],
}: CreateCodeBlockParams): CreateCodeBlockResult => {
	const list = createList({
		localName: "ol",
		lineType: "single-line",
		editState: "inherit",
		childNodes: childNodes.map((line) =>
			createListItem({
				childNodes: [
					createHTMLLayout({
						localName: "div",
						childNodes: [
							createDetachedContext({
								localName: "span",
								shadowTree: [document.createTextNode("0")],
							}),
							createNestedEditable({
								...codeBlockDefinition.lineNestedEditableProps,
								childNodes: [line],
							}),
						],
					}),
				],
			}),
		),
	});

	return createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.codeBlock,
			content: { type: "list" },
			customStorage: createCodeBlockStorage({ language, theme }),
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			editState: "inherit",
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
