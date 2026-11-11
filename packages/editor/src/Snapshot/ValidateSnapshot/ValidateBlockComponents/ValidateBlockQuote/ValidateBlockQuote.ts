import {
	blockComponentRole,
	htmlLayoutRole,
	nestedEditableRole,
} from "@rangex/core";
import { blockQuoteDefinition, componentsName } from "#constants";
import { blockQuoteStoragePattern } from "#storage";
import {
	formatNodePath,
	resolveDraftDOMAttrs,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../_Utilities";
import {
	validateBlockComponentLine,
	validateBlockComponentState,
} from "../_Utilities";
import type {
	CreateBlockQuoteValidatorResult,
	ValidateBlockQuoteParams,
	ValidateBlockQuoteResult,
} from "./ValidateBlockQuote-types";

/*
 * Validates a BlockQuote, its BlockComponentLine, and everything down to its NestedEditable, node by node: each node's
 * own state, then its children. It's built as a BlockComponent holding a blockquote, which holds the NestedEditable
 * (its state by the blockQuoteDefinition). It has no attributes, so every attribute of these nodes is dropped. The NestedEditable's content is
 * left to the engine's validation.
 */
const validateBlockQuote = ({
	componentDraft,
}: ValidateBlockQuoteParams): ValidateBlockQuoteResult => {
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
			name: componentsName.blockQuote,
			content: { type: "styled-block" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			customStorage: blockQuoteStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
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
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const htmlLayoutDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		htmlLayoutDraft?.editorRole !== htmlLayoutRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const htmlLayoutStateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "blockquote",
			customStorage: null,
		},
	});

	if (htmlLayoutStateFailed) {
		return htmlLayoutStateFailed;
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

	const { childNodes: htmlLayoutChildNodes } = htmlLayoutDraft;

	const nestedEditableDraft = htmlLayoutChildNodes.at(0);

	if (
		htmlLayoutChildNodes.length !== 1 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${nestedEditableRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			...blockQuoteDefinition.nestedEditableProps,
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
 * Creates the BlockQuote's ComponentValidator.
 */
export const createBlockQuoteValidator =
	(): CreateBlockQuoteValidatorResult => {
		return {
			name: componentsName.blockQuote,
			validate: ({ componentDraft }) => validateBlockQuote({ componentDraft }),
		};
	};
