import {
	blockComponentRole,
	detachedContextRole,
	htmlLayoutRole,
	listRole,
	nestedEditableRole,
} from "@rangex/core";

import { codeBlockDefinition, componentsName } from "#constants";
import { codeBlockAttrsShape, createCodeBlockAttrValidators } from "#dom-attrs";
import { codeBlockStoragePattern } from "#storage";
import { matchJSON } from "#utilities";

import {
	describeJSONMismatch,
	formatNodePath,
	resolveDraftDOMAttrs,
	resolveDraftStorage,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateBlockComponentLine, validateBlockComponentState } from "../_Utilities";
import type {
	CreateCodeBlockValidatorParams,
	CreateCodeBlockValidatorResult,
	ValidateCodeBlockParams,
	ValidateCodeBlockResult,
	ValidateCodeParams,
	ValidateCodeResult,
	ValidateLineNumberParams,
	ValidateLineNumberResult,
	ValidateListItemParams,
	ValidateListItemResult,
	ValidateListParams,
	ValidateListResult,
	ValidatePreParams,
	ValidatePreResult,
} from "./ValidateCodeBlock-types";

/*
 * Validates a line's number: a span DetachedContext whose shadow tree is one text. The text is replaced by the line's
 * position, so a snapshot read without the editor shows the right number.
 */
const validateLineNumber = ({
	componentDraft,
	detachedContextDraft,
	index,
}: ValidateLineNumberParams): ValidateLineNumberResult => {
	const { localName, childNodes, shadowTreeSnapshot } = detachedContextDraft;

	const textSnapshot = shadowTreeSnapshot.at(0);

	if (
		localName !== "span" ||
		childNodes.length !== 0 ||
		shadowTreeSnapshot.length !== 1 ||
		textSnapshot?.type !== "text"
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: detachedContextDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: detachedContextDraft })}: must be a span with one text in its shadow tree.`,
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: detachedContextDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	textSnapshot.data = `${index + 1}`;

	return null;
};

/*
 * Validates a code line: a ListItem holding a div, which holds the line's number and its single-line NestedEditable. The
 * NestedEditable's content is left to the engine's validation.
 */
const validateListItem = ({
	componentDraft,
	listItemDraft,
	index,
}: ValidateListItemParams): ValidateListItemResult => {
	const listItemAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: listItemDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (listItemAttrsFailed) {
		return listItemAttrsFailed;
	}

	const { childNodes } = listItemDraft;

	const htmlLayoutDraft = childNodes.at(0);

	if (childNodes.length !== 1 || htmlLayoutDraft?.editorRole !== htmlLayoutRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: listItemDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: listItemDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "div",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const htmlLayoutAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (htmlLayoutAttrsFailed) {
		return htmlLayoutAttrsFailed;
	}

	const { childNodes: lineParts } = htmlLayoutDraft;

	const [detachedContextDraft, nestedEditableDraft] = lineParts;

	if (
		lineParts.length !== 2 ||
		detachedContextDraft?.editorRole !== detachedContextRole ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain a ${detachedContextRole}, then a ${nestedEditableRole}.`,
		};
	}

	const lineNumberFailed = validateLineNumber({
		componentDraft,
		detachedContextDraft,
		index,
	});

	if (lineNumberFailed) {
		return lineNumberFailed;
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			...codeBlockDefinition.lineNestedEditableProps,
			domAttrs: {},
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	return null;
};

/*
 * Validates the List holding the code lines, then each of its ListItems.
 */
const validateList = ({ componentDraft, listDraft }: ValidateListParams): ValidateListResult => {
	const { localName, lineType, editState, customStorage } = listDraft;

	const listState = { localName, lineType, editState, customStorage };

	const listMismatch = matchJSON({
		value: listState,
		pattern: {
			localName: "ol",
			lineType: "single-line",
			editState: "inherit",
			customStorage: null,
		},
	});

	if (listMismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: listDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: listDraft,
				value: listState,
				mismatch: listMismatch,
			}),
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: listDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = listDraft;

	for (const [index, listItemDraft] of childNodes.entries()) {
		const listItemFailed = validateListItem({
			componentDraft,
			listItemDraft,
			index,
		});

		if (listItemFailed) {
			return listItemFailed;
		}
	}

	return null;
};

/*
 * Validates the code element and its only child, the List.
 */
const validateCode = ({
	componentDraft,
	htmlLayoutDraft,
}: ValidateCodeParams): ValidateCodeResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "code",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const listDraft = childNodes.at(0);

	if (childNodes.length !== 1 || listDraft?.editorRole !== listRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${listRole}.`,
		};
	}

	const listFailed = validateList({ componentDraft, listDraft });

	if (listFailed) {
		return listFailed;
	}

	return null;
};

/*
 * Validates the pre element and its only child, the code element.
 */
const validatePre = ({ componentDraft, htmlLayoutDraft }: ValidatePreParams): ValidatePreResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "pre",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const codeDraft = childNodes.at(0);

	if (childNodes.length !== 1 || codeDraft?.editorRole !== htmlLayoutRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const codeFailed = validateCode({
		componentDraft,
		htmlLayoutDraft: codeDraft,
	});

	if (codeFailed) {
		return codeFailed;
	}

	return null;
};

/*
 * Validates a CodeBlock, its BlockComponentLine, and everything down to its NestedEditables, node by node: each node's
 * own state, then its children. It's built as a BlockComponent holding a pre, a code, and a List with one ListItem per
 * code line. Its storage must match codeBlockStoragePattern, then it's resolved by the consumer's validateStorage (see
 * resolveDraftStorage). The BlockComponent's domAttrs (the theme's colors) are resolved by the given validators, every
 * other node's by an empty shape. The NestedEditables' content is left to the engine's validation.
 */
const validateCodeBlock = ({
	componentDraft,
	attrValidators,
	validateStorage,
}: ValidateCodeBlockParams): ValidateCodeBlockResult => {
	if (componentDraft.editorRole !== blockComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
		};
	}

	const stateFailed = validateBlockComponentState({
		blockComponentDraft: componentDraft,
		expectedState: {
			editorRole: blockComponentRole,
			name: componentsName.codeBlock,
			content: { type: "list" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			customStorage: codeBlockStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const storageFailed = resolveDraftStorage({
		nodeDraft: componentDraft,
		storagePattern: codeBlockStoragePattern,
		validateStorage,
	});

	if (storageFailed) {
		return storageFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape: {},
		lineAttrValidators: {},
	});

	if (lineFailed) {
		return lineFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: codeBlockAttrsShape.codeBlock,
		elementAttrValidators: attrValidators.codeBlock,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const preDraft = childNodes.at(0);

	if (childNodes.length !== 1 || preDraft?.editorRole !== htmlLayoutRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const preFailed = validatePre({
		componentDraft,
		htmlLayoutDraft: preDraft,
	});

	if (preFailed) {
		return preFailed;
	}

	return null;
};

/*
 * Creates the CodeBlock's ComponentValidator, which validates the CodeBlocks' attributes by the default validators,
 * replaced by the given ones (see createCodeBlockAttrValidators), and resolves their storage by the given validateStorage.
 */
export const createCodeBlockValidator = ({
	attrValidators = {},
	validateStorage,
}: CreateCodeBlockValidatorParams): CreateCodeBlockValidatorResult => {
	const codeBlockAttrValidators = createCodeBlockAttrValidators(attrValidators);

	return {
		name: componentsName.codeBlock,
		validate: ({ componentDraft }) =>
			validateCodeBlock({
				componentDraft,
				attrValidators: codeBlockAttrValidators,
				validateStorage,
			}),
	};
};
