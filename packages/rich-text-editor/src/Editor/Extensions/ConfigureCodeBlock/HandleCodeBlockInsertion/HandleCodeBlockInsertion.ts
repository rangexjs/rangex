import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createDetachedContext,
	createHTMLLayout,
	createList,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { toHighlighterLang } from "../_Utilities";
import { createCodeBlockStorage } from "../CodeBlockStorage";
import type {
	CreateCodeBlockLineParams,
	CreateCodeBlockLineResult,
	HandleCodeBlockInsertionParams,
} from "./HandleCodeBlockInsertion-types";

const createCodeBlockComponent = ({
	language,
}: CreateCodeBlockLineParams): CreateCodeBlockLineResult => {
	const list = createList({
		localName: "ol",
		lineType: "single-line",
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

	const blockNestedContextLine = createBlockNestedContextLine({
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

	return blockNestedContextLine;
};

export const handleCodeBlockInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(({ language }) => {
		const codeBlockLine = createCodeBlockComponent({ language });

		const list = codeBlockLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listName) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockNestedContextLine: codeBlockLine,
			target: list,
		});

		const lastListItem = list.$$children.at(-1);

		if (!lastListItem) {
			throw new Error("LastListItem can't be undefined.");
		}

		const nestedEditable = lastListItem.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableName) {
			throw new Error("NestedEditable's type is invalid.");
		}

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
