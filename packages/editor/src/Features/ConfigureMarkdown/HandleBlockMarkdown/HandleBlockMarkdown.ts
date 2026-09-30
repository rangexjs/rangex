import {
	createContentLine,
	createFormattableTexts,
	EditorRange,
	listRole,
	listRoleSelector,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { componentsName, getClosestScopedEditable } from "#engine-links";
import { assertNever } from "#utilities";
import {
	createBlockQuote,
	createCodeBlock,
	createList,
	createTodoList,
} from "../../_Utilities";
import {
	getLineMarkdownPrefix,
	isPrefixAtContentLineStart,
} from "../_Utilities";
import type {
	ApplyBlockMarkdownConversionParams,
	CanApplyBlockMarkdownConversionParams,
	ConvertToBlockQuoteParams,
	ConvertToCodeBlockParams,
	ConvertToListParams,
	ConvertToTodoListParams,
	HandleBlockMarkdownParams,
	HeadingLocalName,
	MatchBlockTriggerParams,
	MatchBlockTriggerResult,
	WrapListShapedParams,
} from "./HandleBlockMarkdown-types";

const matchBlockTrigger = ({
	configPort,
	prefix,
}: MatchBlockTriggerParams): MatchBlockTriggerResult => {
	if (/^#{1,6}$/.test(prefix)) {
		return {
			type: "heading",
			localName: `h${prefix.length}` as HeadingLocalName,
		};
	}

	if (/^[-*+]$/.test(prefix)) {
		return { type: "list", localName: "ul" };
	}

	if (/^1\.$/.test(prefix)) {
		return { type: "list", localName: "ol" };
	}

	if (/^\[ ?\]$/.test(prefix)) {
		return { type: "todoList" };
	}

	if (/^>$/.test(prefix)) {
		return { type: "blockQuote" };
	}

	const codeBlockMatch = /^```(\S*)$/.exec(prefix);

	if (codeBlockMatch) {
		const [, group = ""] = codeBlockMatch;

		const lowerCaseGroup = group.toLowerCase();

		const codeBlockTrigger = configPort.codeBlockTriggers.find(
			({ trigger }) => trigger.toLowerCase() === lowerCaseGroup,
		);

		if (!codeBlockTrigger) {
			return null;
		}

		const { language, theme } = codeBlockTrigger;

		return { type: "codeBlock", language, theme };
	}

	return null;
};

const canApplyBlockMarkdownConversion = ({
	editorAPI,
	blockComponentPlacement,
	conversion,
}: CanApplyBlockMarkdownConversionParams) => {
	if (conversion.type === "heading") {
		const selection = editorAPI.getEditorSelection();

		const { fromText } = selection.getBoundaryPoints();

		const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

		if (!scopedEditable) {
			throw new Error("ScopedEditable not supposed to be null.");
		}

		if (scopedEditable.$$display === "inline") {
			return false;
		}

		const { $$allowedContentLineLocalNames } = scopedEditable;

		if (!$$allowedContentLineLocalNames) {
			return true;
		}

		return $$allowedContentLineLocalNames.includes(conversion.localName);
	}

	if (conversion.type === "list") {
		return blockComponentPlacement.canWrapBySelection({
			scope: "current",
			allowedComponents: [componentsName.list],
		});
	}

	if (conversion.type === "todoList") {
		return blockComponentPlacement.canWrapBySelection({
			scope: "current",
			allowedComponents: [componentsName.todoList],
		});
	}

	if (conversion.type === "blockQuote") {
		return blockComponentPlacement.canWrapBySelection({
			scope: "current",
			allowedComponents: [componentsName.blockQuote],
		});
	}

	if (conversion.type === "codeBlock") {
		return blockComponentPlacement.canWrapBySelection({
			scope: "current",
			allowedComponents: [componentsName.codeBlock],
		});
	}

	return assertNever(conversion);
};

const wrapListShaped = ({
	editorAPI,
	blockComponentPlacement,
	blockComponentLine,
}: WrapListShapedParams) => {
	const selection = editorAPI.getEditorSelection();

	const list = blockComponentLine.$$querySelector(listRoleSelector);

	if (list?.$$editorRole !== listRole) {
		throw new Error("List's type is invalid.");
	}

	blockComponentPlacement.wrapBySelection({ blockComponentLine, target: list });

	const lastListItem = list.$$children.at(-1);

	if (!lastListItem) {
		throw new Error("LastListItem can't be undefined.");
	}

	const nestedEditable = lastListItem.$$querySelector(
		nestedEditableRoleSelector,
	);

	if (nestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("NestedEditable's type is invalid.");
	}

	selection.setBoundaryPoints({
		fromNode: nestedEditable,
		fromOffset: nestedEditable.$$childNodes.length,
		toNode: nestedEditable,
		toOffset: nestedEditable.$$childNodes.length,
	});
};

const convertToList = ({
	editorAPI,
	blockComponentPlacement,
	localName,
}: ConvertToListParams) => {
	wrapListShaped({
		editorAPI,
		blockComponentPlacement,
		blockComponentLine: createList({ localName, lineType: "multi-line" }),
	});
};

const convertToTodoList = ({
	editorAPI,
	blockComponentPlacement,
}: ConvertToTodoListParams) => {
	wrapListShaped({
		editorAPI,
		blockComponentPlacement,
		blockComponentLine: createTodoList({}),
	});
};

const convertToCodeBlock = ({
	editorAPI,
	blockComponentPlacement,
	language,
	theme,
}: ConvertToCodeBlockParams) => {
	wrapListShaped({
		editorAPI,
		blockComponentPlacement,
		blockComponentLine: createCodeBlock({ language, theme }),
	});
};

const convertToBlockQuote = ({
	editorAPI,
	blockComponentPlacement,
}: ConvertToBlockQuoteParams) => {
	const selection = editorAPI.getEditorSelection();

	const blockQuoteLine = createBlockQuote({});

	const nestedEditable = blockQuoteLine.$$querySelector(
		nestedEditableRoleSelector,
	);

	if (nestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("NestedEditable's type is invalid.");
	}

	blockComponentPlacement.wrapBySelection({
		blockComponentLine: blockQuoteLine,
		target: nestedEditable,
	});

	selection.setBoundaryPoints({
		fromNode: nestedEditable,
		fromOffset: nestedEditable.$$childNodes.length,
		toNode: nestedEditable,
		toOffset: nestedEditable.$$childNodes.length,
	});
};

const applyBlockMarkdownConversion = ({
	editorAPI,
	blockComponentPlacement,
	conversion,
}: ApplyBlockMarkdownConversionParams) => {
	if (conversion.type === "heading") {
		editorAPI.updateSelectionStyles({ localName: conversion.localName });
		return;
	}

	if (conversion.type === "list") {
		convertToList({
			editorAPI,
			blockComponentPlacement,
			localName: conversion.localName,
		});
		return;
	}

	if (conversion.type === "todoList") {
		convertToTodoList({ editorAPI, blockComponentPlacement });
		return;
	}

	if (conversion.type === "blockQuote") {
		convertToBlockQuote({ editorAPI, blockComponentPlacement });
		return;
	}

	if (conversion.type === "codeBlock") {
		convertToCodeBlock({
			editorAPI,
			blockComponentPlacement,
			language: conversion.language,
			theme: conversion.theme,
		});
		return;
	}

	assertNever(conversion);
};

/*
 * Detects a completed block-level markdown trigger (e.g. "###", "-", "1.", "[]", ">", "```ts")
 * on the space keystroke that completes it, and converts the current line accordingly, letting
 * the keystroke insert natively first so a single undo can restore the literal text.
 */
export const handleBlockMarkdown = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockMarkdownParams) => {
	const selection = editorAPI.getEditorSelection();

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unregister = editorAPI.registerEventInterceptor({
		type: "beforeinput",
		interceptor: (event) => {
			if (event.data !== " ") {
				return false;
			}

			const beforeTriggerBoundary = selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: beforeTriggerBoundary.fromText,
				fromOffset: beforeTriggerBoundary.fromOffset,
				toNode: beforeTriggerBoundary.toText,
				toOffset: beforeTriggerBoundary.toOffset,
			});

			if (!range.isSinglePoint) {
				return false;
			}

			const { startText, startOffset } = range;

			const prefix = getLineMarkdownPrefix({
				editorAPI,
				fromText: startText,
				fromOffset: startOffset,
			});

			if (!prefix) {
				return false;
			}

			const conversion = matchBlockTrigger({
				configPort,
				prefix: prefix.data,
			});

			if (!conversion) {
				return false;
			}

			const isAtLineStart = isPrefixAtContentLineStart({ prefix });

			if (!isAtLineStart) {
				return false;
			}

			const canApply = canApplyBlockMarkdownConversion({
				editorAPI,
				blockComponentPlacement,
				conversion,
			});

			if (!canApply) {
				return false;
			}

			// Materialize the triggering keystroke so the full marker (e.g. "### ", "```ts ")
			// lands in the DOM before conversion — a single undo afterwards restores it.
			editorAPI.insertNode({
				fromNode: startText,
				fromOffset: startOffset,
				lines: [
					createContentLine({
						localName: "p",
						childNodes: [...createFormattableTexts({ data: event.data })],
					}),
				],
				breakBeforeInsert: false,
			});

			// The insert above updated the text nodes — re-scan for the removal boundary.
			const afterTriggerBoundary = selection.getBoundaryPoints();

			const fullPrefix = getLineMarkdownPrefix({
				editorAPI,
				fromText: afterTriggerBoundary.fromText,
				fromOffset: afterTriggerBoundary.fromOffset,
			});

			if (!fullPrefix) {
				console.warn(
					"handleBlockMarkdown: could not re-locate the line prefix after inserting the trigger character.",
				);
				return true;
			}

			// Commit the completed marker as its own undo step before converting it.
			snapshotTimeline.registerSnapshotBoundary();
			editorAPI.flushEditorEvents();

			editorAPI.removeNodesInRange({
				fromNode: fullPrefix.toText,
				fromOffset: fullPrefix.toOffset,
				toNode: afterTriggerBoundary.fromText,
				toOffset: afterTriggerBoundary.fromOffset,
			});

			applyBlockMarkdownConversion({
				editorAPI,
				blockComponentPlacement,
				conversion,
			});

			snapshotTimeline.registerSnapshotBoundary();

			editorAPI.focus();

			return true;
		},
	});

	return () => {
		unregister();
	};
};
