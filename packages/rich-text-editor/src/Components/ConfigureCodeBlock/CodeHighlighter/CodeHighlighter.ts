import {
	type BlockNestedContext,
	blockNestedContextName,
	inlineNestedContextAttrName,
	isContentLineText,
	isEditorNode,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { syntaxHighlighter } from "../../../Libs";
import { getClosestBlockNestedContext } from "../../../NodeQuery";
import { ensureCodeBlockStorage } from "../CodeBlockStorage";
import type {
	ApplyTokenColorsParams,
	CodeHighlighterConstructorParams,
	CodeHighlighterUpdateParams,
	GetCodeLinesParams,
	GetCodeLinesResult,
	OnCodeChangeParams,
	UpdateCodeBlockColorsParams,
	WatchCodeBlocksParams,
} from "./CodeHighlighter-types";
import { CSSHighlightManager } from "./CSSHighlightManager";

/**
 * Tracks CodeBlocks added to {@link rootEditable}, calling {@link onCodeChange}
 * immediately on insertion (for initial highlight) and on every subsequent character change.
 */
const watchCodeBlocks = ({
	rootEditable,
	onCodeChange,
}: WatchCodeBlocksParams) => {
	const { dataComponentName } = inlineNestedContextAttrName;

	const selector =
		`[${dataComponentName}="${componentsName.codeBlock}"]` as const;

	const trackedCodeBlocks = new Set<BlockNestedContext>();

	const codeChangeObserver = new MutationObserver((mutations) => {
		for (const { target } of mutations) {
			if (!isEditorNode(target)) {
				throw new Error("Target supposed to be an EditorNode.");
			}

			if (!target.isConnected) {
				continue;
			}

			const blockNestedContext = getClosestBlockNestedContext({
				fromNode: target,
				componentName: componentsName.codeBlock,
			});

			if (!blockNestedContext) {
				throw new Error("BlockNestedContext can't be null.");
			}

			onCodeChange({ blockNestedContext });
		}
	});

	const trackNewCodeBlocks = () => {
		const queriedCodeBlocks = rootEditable.$$querySelectorAll(selector);

		if (
			!queriedCodeBlocks.every(
				(codeBlock) => codeBlock.$$editorRole === blockNestedContextName,
			)
		) {
			throw new Error("CodeBlock's type is invalid.");
		}

		const containedCodeBlocks = new Set<BlockNestedContext>(queriedCodeBlocks);

		const addedCodeBlocks = containedCodeBlocks.difference(trackedCodeBlocks);

		for (const codeBlock of addedCodeBlocks) {
			onCodeChange({ blockNestedContext: codeBlock });

			codeChangeObserver.observe(codeBlock, {
				subtree: true,
				characterData: true,
			});
		}
	};

	trackNewCodeBlocks();

	const codeBlockObserver = new MutationObserver(() => {
		trackNewCodeBlocks();
	});

	codeBlockObserver.observe(rootEditable, { childList: true, subtree: true });
};

/**
 * Extract plain text from a nested editable and split by newlines.
 * Retrieves the full text content from the editable node and returns
 * an array of lines separated by "\n".
 */
const getCodeLines = ({
	editorAPI,
	nestedEditable,
}: GetCodeLinesParams): GetCodeLinesResult => {
	const plainText = editorAPI.getPlainText({
		fromNode: nestedEditable,
		fromOffset: 0,
		toNode: nestedEditable,
		toOffset: nestedEditable.childNodes.length,
	});

	const codeLines = plainText.split("\n");

	return codeLines;
};

/**
 * Map tokenized code lines to DOM text nodes and apply theme-aware
 * syntax highlighting via CSS Highlight API. Creates ranges for each
 * token and applies light/dark theme colors.
 */
const applyTokenColors = ({
	editorAPI,
	nestedEditable,
	cssHighlightManager,
	codeLines,
	theme,
}: ApplyTokenColorsParams) => {
	try {
		cssHighlightManager.clear({ nestedEditable });

		for (let i = 0; i < codeLines.length; i++) {
			const highlightedLine = codeLines[i];
			const contentLine = nestedEditable.$$childNodes[i];

			const { $$firstChild } = contentLine;

			let currentText = $$firstChild;
			let currentOffset = 0;

			for (const chars of highlightedLine) {
				const { colors, content } = chars;

				if (!(currentText && isContentLineText(currentText))) {
					throw new Error("CurrentChild's type is invalid.");
				}

				const { plainTextScanner } = editorAPI.createPlainTextScanner({
					fromNode: currentText,
					fromOffset: currentOffset,
					direction: "forward",
				});

				for (const { data, toText, toOffset } of plainTextScanner) {
					if (data.startsWith(content)) {
						const range = new Range();
						range.setStart(currentText, currentOffset);
						range.setEnd(toText, toOffset);

						currentText = toText;
						currentOffset = toOffset;

						const { light, dark } = theme;

						const lightColor = colors[light];
						const darkColor = colors[dark];

						cssHighlightManager.addHighlight({
							nestedEditable,
							theme: { light: lightColor, dark: darkColor },
							range,
						});

						break;
					}
				}
			}
		}
	} catch (error) {
		console.info(
			"applyTokenColors failed — DOM mutated between token calculation and application. The next update will apply the correct tokens.",
			error,
		);
	}
};

/**
 * Re-tokenize code block content and apply syntax highlighting.
 * Retrieves the current language/theme from block storage, tokenizes
 * the code, applies background color, and highlights all tokens.
 */
const updateCodeBlockColors = async ({
	editorAPI,
	cssHighlightManager,
	blockNestedContext,
}: UpdateCodeBlockColorsParams) => {
	const { lang, theme } = ensureCodeBlockStorage({ blockNestedContext });

	const nestedEditable = blockNestedContext.$$querySelector(
		nestedEditableRoleSelector,
	);

	if (nestedEditable?.$$editorRole !== nestedEditableName) {
		throw new Error("NestedEditable's type is invalid.");
	}

	const lines = getCodeLines({ editorAPI, nestedEditable });

	const { backgrounds, codeLines } = await syntaxHighlighter.getHighlightInfo({
		lines,
		lang,
	});

	const bgLight = backgrounds[theme.light];
	const bgDark = backgrounds[theme.dark];

	const background = `light-dark(${bgLight}, ${bgDark})`;

	blockNestedContext.style.background = background;

	applyTokenColors({
		editorAPI,
		nestedEditable,
		cssHighlightManager,
		codeLines,
		theme,
	});
};

export class CodeHighlighter {
	#editorAPI;
	#cssHighlightManager = new CSSHighlightManager();

	constructor({ editorAPI }: CodeHighlighterConstructorParams) {
		this.#editorAPI = editorAPI;

		const { shadowRoot, rootEditable } = this.#editorAPI;

		shadowRoot.adoptedStyleSheets.push(this.#cssHighlightManager.cssStyleSheet);

		const onCodeChange = ({ blockNestedContext }: OnCodeChangeParams) => {
			updateCodeBlockColors({
				editorAPI: this.#editorAPI,
				cssHighlightManager: this.#cssHighlightManager,
				blockNestedContext,
			});
		};

		watchCodeBlocks({ rootEditable, onCodeChange });
	}

	update({ blockNestedContext, lang, theme }: CodeHighlighterUpdateParams) {
		const customStorage = ensureCodeBlockStorage({ blockNestedContext });
		customStorage.lang = lang;
		customStorage.theme = theme;

		updateCodeBlockColors({
			editorAPI: this.#editorAPI,
			cssHighlightManager: this.#cssHighlightManager,
			blockNestedContext,
		});
	}
}
