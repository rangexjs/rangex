import {
	type BlockComponent,
	blockComponentRole,
	contentLineRole,
	contentLineRoleSelector,
	isContentLineText,
	isEditorNode,
	listRole,
	listRoleSelector,
	snapshotIndexChangeEventType,
} from "@rangex/core";

import { componentsName, createComponentSelector } from "#constants";
import { codeBlockAttrsShape, resolveElementAttrs, writeElementAttrs } from "#dom-attrs";
import { getClosestBlockComponent } from "#engine-links";
import { codeBlockStorageFallbacks, ensureNodeCodeBlockStorage } from "#storage";

import type {
	ApplyTokenColorsParams,
	ClearCodeBlockColorsParams,
	CodeBlockHighlight,
	CodeHighlighterConstructorParams,
	CodeHighlighterUpdateParams,
	GetCodeBlockListParams,
	GetCodeLinesParams,
	GetCodeLinesResult,
	GetOutdatedCodeBlocksParams,
	IsSameHighlightParams,
	OnCodeBlockRemoveParams,
	OnCodeChangeParams,
	UpdateCodeBlockColorsParams,
	WatchCodeBlocksParams,
	WriteCodeBlockColorsParams,
} from "./CodeHighlighter-types";
import { CSSHighlightManager } from "./CSSHighlightManager";

const codeBlockSelector = createComponentSelector(componentsName.codeBlock);

const emptyCodeBlockColors = {
	"data-bg-light": null,
	"data-bg-dark": null,
	"data-fg-light": null,
	"data-fg-dark": null,
};

/**
 * Tracks CodeBlocks added to {@link rootEditable}, calling {@link onCodeChange}
 * immediately on insertion (for initial highlight) and on every subsequent code change. Calls
 * {@link onCodeBlockRemove} once a tracked CodeBlock leaves the document. Returns a cleanup function.
 */
const watchCodeBlocks = ({
	rootEditable,
	onCodeChange,
	onCodeBlockRemove,
}: WatchCodeBlocksParams) => {
	const trackedCodeBlocks = new Set<BlockComponent>();

	const codeChangeObserver = new MutationObserver((mutations) => {
		const changedCodeBlocks = new Set<BlockComponent>();

		for (const { target } of mutations) {
			if (!isEditorNode(target)) {
				throw new Error("Target supposed to be an EditorNode.");
			}

			if (!target.isConnected) {
				continue;
			}

			const blockComponent = getClosestBlockComponent({
				fromNode: target,
				components: [componentsName.codeBlock],
			});

			if (!blockComponent) {
				continue;
			}

			changedCodeBlocks.add(blockComponent);
		}

		for (const blockComponent of changedCodeBlocks) {
			onCodeChange({ blockComponent });
		}
	});

	const syncTrackedCodeBlocks = () => {
		const queriedCodeBlocks = rootEditable.$$querySelectorAll(codeBlockSelector);

		if (!queriedCodeBlocks.every((codeBlock) => codeBlock.$$editorRole === blockComponentRole)) {
			throw new Error("CodeBlock's type is invalid.");
		}

		const containedCodeBlocks = new Set<BlockComponent>(queriedCodeBlocks);

		const addedCodeBlocks = containedCodeBlocks.difference(trackedCodeBlocks);
		const removedCodeBlocks = trackedCodeBlocks.difference(containedCodeBlocks);

		for (const codeBlock of removedCodeBlocks) {
			trackedCodeBlocks.delete(codeBlock);

			onCodeBlockRemove({ blockComponent: codeBlock });
		}

		for (const codeBlock of addedCodeBlocks) {
			trackedCodeBlocks.add(codeBlock);

			onCodeChange({ blockComponent: codeBlock });

			codeChangeObserver.observe(codeBlock, {
				subtree: true,
				characterData: true,
				childList: true,
			});
		}
	};

	syncTrackedCodeBlocks();

	const codeBlockObserver = new MutationObserver(() => {
		syncTrackedCodeBlocks();
	});

	codeBlockObserver.observe(rootEditable, { childList: true, subtree: true });

	return () => {
		codeChangeObserver.disconnect();
		codeBlockObserver.disconnect();
	};
};

/*
 * Returns the code block's List, which holds its code lines.
 */
const getCodeBlockList = ({ blockComponent }: GetCodeBlockListParams) => {
	const list = blockComponent.$$querySelector(listRoleSelector);

	if (list?.$$editorRole !== listRole) {
		throw new Error("List's type is invalid.");
	}

	return list;
};

/**
 * Extract plain text from a nested editable and split by newlines.
 * Retrieves the full text content from the editable node and returns
 * an array of lines separated by "\n".
 */
const getCodeLines = ({ editorAPI, list }: GetCodeLinesParams): GetCodeLinesResult => {
	const codeLines: string[] = [];

	const contentLines = list.$$children.map((li) => {
		const contentLine = li.$$querySelector(contentLineRoleSelector);

		if (contentLine?.$$editorRole !== contentLineRole) {
			throw new Error("ContentLine's type is invalid.");
		}

		return contentLine;
	});

	for (const contentLine of contentLines) {
		const plainText = editorAPI.getPlainText({
			fromNode: contentLine,
			fromOffset: 0,
			toNode: contentLine,
			toOffset: contentLine.$$childNodes.length,
		});

		codeLines.push(plainText);
	}

	return codeLines;
};

/**
 * Removes any applied highlight colors/CSS Highlight ranges from a code block, restoring it to
 * its unhighlighted appearance.
 */
const clearCodeBlockColors = ({
	blockComponent,
	cssHighlightManager,
	list,
}: ClearCodeBlockColorsParams) => {
	cssHighlightManager.clear({ list });

	writeElementAttrs({
		element: blockComponent,
		elementAttrs: emptyCodeBlockColors,
	});
};

/*
 * Sets the theme's colors on the code block. A color the CodeBlock's attribute validators don't accept isn't set, so the
 * styles' defaults apply.
 */
const writeCodeBlockColors = ({
	blockComponent,
	attrValidators,
	backgrounds,
	foregrounds,
}: WriteCodeBlockColorsParams) => {
	const resolvedColors = resolveElementAttrs({
		elementAttrs: {
			"data-bg-light": backgrounds.light,
			"data-bg-dark": backgrounds.dark,
			"data-fg-light": foregrounds.light,
			"data-fg-dark": foregrounds.dark,
		},
		elementAttrsShape: codeBlockAttrsShape.codeBlock,
		elementAttrValidators: attrValidators.codeBlock,
	});

	if (resolvedColors.kind === "invalid") {
		console.warn(resolvedColors.mismatch);

		writeElementAttrs({
			element: blockComponent,
			elementAttrs: emptyCodeBlockColors,
		});
		return;
	}

	writeElementAttrs({
		element: blockComponent,
		elementAttrs: { ...emptyCodeBlockColors, ...resolvedColors.elementAttrs },
	});
};

/**
 * Map tokenized code lines to DOM text nodes and apply theme-aware
 * syntax highlighting via CSS Highlight API. Creates ranges for each
 * token and applies light/dark theme colors.
 */
const applyTokenColors = ({
	editorAPI,
	list,
	cssHighlightManager,
	codeLines,
}: ApplyTokenColorsParams) => {
	try {
		cssHighlightManager.clear({ list });

		const contentLines = list.$$children.map((li) => {
			const contentLine = li.$$querySelector(contentLineRoleSelector);

			if (contentLine?.$$editorRole !== contentLineRole) {
				throw new Error("ContentLine's type is invalid.");
			}

			return contentLine;
		});

		for (let i = 0; i < codeLines.length; i++) {
			const highlightedLine = codeLines[i];
			const contentLine = contentLines[i];

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

						cssHighlightManager.addHighlight({ list, theme: colors, range });

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
	getHighlightInfo,
	attrValidators,
	cssHighlightManager,
	blockComponent,
}: UpdateCodeBlockColorsParams) => {
	if (!getHighlightInfo) {
		return;
	}

	const { language, theme } = ensureNodeCodeBlockStorage({
		blockComponent,
		fallbacks: codeBlockStorageFallbacks,
	});

	const list = getCodeBlockList({ blockComponent });

	if (language === null || theme === null) {
		clearCodeBlockColors({ blockComponent, cssHighlightManager, list });
		return;
	}

	const lines = getCodeLines({ editorAPI, list });

	const highlightInfo = await getHighlightInfo({ lines, language, theme });

	if (!highlightInfo) {
		clearCodeBlockColors({ blockComponent, cssHighlightManager, list });
		return;
	}

	const { backgrounds, foregrounds, codeLines } = highlightInfo;

	writeCodeBlockColors({
		blockComponent,
		attrValidators,
		backgrounds,
		foregrounds,
	});

	applyTokenColors({ editorAPI, list, cssHighlightManager, codeLines });
};

const isSameHighlight = ({ source, target }: IsSameHighlightParams) => {
	if (source.language !== target.language) {
		return false;
	}

	const { theme: sourceTheme } = source;
	const { theme: targetTheme } = target;

	if (sourceTheme === null || targetTheme === null) {
		return sourceTheme === targetTheme;
	}

	return sourceTheme.light === targetTheme.light && sourceTheme.dark === targetTheme.dark;
};

/*
 * Returns the code blocks whose stored language/theme differs from the one they were last highlighted with.
 */
const getOutdatedCodeBlocks = ({
	rootEditable,
	appliedHighlights,
}: GetOutdatedCodeBlocksParams) => {
	const codeBlocks = rootEditable.$$querySelectorAll(codeBlockSelector);

	const outdatedCodeBlocks: BlockComponent[] = [];

	for (const codeBlock of codeBlocks) {
		if (codeBlock.$$editorRole !== blockComponentRole) {
			throw new Error("CodeBlock's type is invalid.");
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: codeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});

		const appliedHighlight = appliedHighlights.get(codeBlock);

		const isUpToDate =
			appliedHighlight !== undefined &&
			isSameHighlight({ source: appliedHighlight, target: storage });

		if (!isUpToDate) {
			outdatedCodeBlocks.push(codeBlock);
		}
	}

	return outdatedCodeBlocks;
};

export class CodeHighlighter {
	#editorAPI;
	#getHighlightInfo;
	#attrValidators;
	#cssHighlightManager = new CSSHighlightManager();
	// The language/theme each code block was last highlighted with.
	#appliedHighlights = new WeakMap<BlockComponent, CodeBlockHighlight>();
	#cleanups = new Set<() => void>();

	constructor({ editorAPI, getHighlightInfo, attrValidators }: CodeHighlighterConstructorParams) {
		this.#editorAPI = editorAPI;
		this.#getHighlightInfo = getHighlightInfo;
		this.#attrValidators = attrValidators;

		const { shadowRoot, rootEditable } = this.#editorAPI;

		shadowRoot.adoptedStyleSheets.push(this.#cssHighlightManager.cssStyleSheet);

		const onCodeChange = ({ blockComponent }: OnCodeChangeParams) => {
			this.#highlight(blockComponent);
		};

		const onCodeBlockRemove = ({ blockComponent }: OnCodeBlockRemoveParams) => {
			const list = getCodeBlockList({ blockComponent });

			this.#cssHighlightManager.clear({ list });
		};

		const unwatchCodeBlocks = watchCodeBlocks({
			rootEditable,
			onCodeChange,
			onCodeBlockRemove,
		});

		// Undo/redo restores the language/theme in storage without touching the code, so the watcher misses it.
		const unsubscribeSnapshotIndexChange = this.#editorAPI.subscribeEditorEvent({
			type: snapshotIndexChangeEventType,
			callback: () => {
				const outdatedCodeBlocks = getOutdatedCodeBlocks({
					rootEditable,
					appliedHighlights: this.#appliedHighlights,
				});

				for (const codeBlock of outdatedCodeBlocks) {
					this.#highlight(codeBlock);
				}
			},
		});

		this.#cleanups.add(unwatchCodeBlocks);
		this.#cleanups.add(unsubscribeSnapshotIndexChange);
	}

	#highlight(blockComponent: BlockComponent) {
		const { language, theme } = ensureNodeCodeBlockStorage({
			blockComponent,
			fallbacks: codeBlockStorageFallbacks,
		});

		this.#appliedHighlights.set(blockComponent, {
			language,
			theme: theme && { ...theme },
		});

		updateCodeBlockColors({
			editorAPI: this.#editorAPI,
			getHighlightInfo: this.#getHighlightInfo,
			attrValidators: this.#attrValidators,
			cssHighlightManager: this.#cssHighlightManager,
			blockComponent,
		});
	}

	update({ blockComponent, language, theme }: CodeHighlighterUpdateParams) {
		const customStorage = ensureNodeCodeBlockStorage({
			blockComponent,
			fallbacks: codeBlockStorageFallbacks,
		});
		customStorage.language = language;
		customStorage.theme = theme;

		this.#highlight(blockComponent);
	}

	cleanup() {
		for (const cleanup of this.#cleanups) {
			cleanup();
		}

		this.#cleanups.clear();
	}
}
