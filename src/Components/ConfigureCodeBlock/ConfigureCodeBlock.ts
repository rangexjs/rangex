import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createNestedEditable,
	editorSelectionChangeEventType,
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

const createCodeBlockComponent = ({
	// biome-ignore lint/correctness/noUnusedFunctionParameters: UI change required
	language,
}: CreateCodeBlockLineParams): CreateCodeBlockLineResult => {
	const nestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block multi-line",
		allowedComponents: [],
		allowedContentLineLocalNames: [],
		allowedContentLineStyleAttrNames: [],
		allowedGlyphFormatterInlineTags: [],
		allowedGlyphFormatterStyleAttrNames: [],
	});

	const blockNestedContextLine = createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.codeBlock,
			content: { type: "styled-block" },
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
							childNodes: [nestedEditable],
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

		const nestedEditable = codeBlockLine.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableName) {
			throw new Error("NestedEditable's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockNestedContextLine: codeBlockLine,
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

	// biome-ignore lint/correctness/noUnusedVariables: UI will be implemented later
	const codeHighlighter = new CodeHighlighter({ editorAPI });
};
