import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createDetachedContext,
	createHTMLLayout,
	createList,
	editorSelectionChangeEventType,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../Constants";
import { createCodeBlockStorage } from "./CodeBlockStorage";
import { CodeHighlighter } from "./CodeHighlighter";
import type {
	ConfigureCodeBlockParams,
	CreateCodeBlockLineParams,
	CreateCodeBlockLineResult,
} from "./ConfigureCodeBlock-types";
import { syncLineNumbers } from "./SyncLineNumbers";

const createCodeBlockComponent = ({
	// biome-ignore lint/correctness/noUnusedFunctionParameters: UI change required
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
				lang: "typescript",
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

export const configureCodeBlock = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureCodeBlockParams) => {
	editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const canWrap = blockComponentPlacement.canWrapBySelection({
				allowedComponents: [componentsName.codeBlock],
			});

			richTextEditorUI.updateNodeInsertionButtonState({
				codeBlock: { disabled: !canWrap },
			});
		},
	});

	richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "code-block") {
			return;
		}

		const { language } = params;

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

	// biome-ignore lint/correctness/noUnusedVariables: UI will be implemented later
	const codeHighlighter = new CodeHighlighter({ editorAPI });

	syncLineNumbers({ editorAPI });
};
