import {
	blockComponentRole,
	detachedContextRole,
	htmlLayoutRole,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName } from "#constants";
import {
	accordionItemAttrsShape,
	createAccordionItemAttrValidators,
} from "#dom-attrs";
import { accordionItemStoragePattern } from "#storage";
import { matchJSON } from "#utilities";
import {
	describeJSONMismatch,
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
	CreateAccordionItemValidatorParams,
	CreateAccordionItemValidatorResult,
	DetachedContextState,
	ValidateAccordionItemParams,
	ValidateAccordionItemResult,
	ValidateChevronParams,
	ValidateChevronResult,
	ValidateDetailsParams,
	ValidateDetailsResult,
	ValidateSummaryParams,
	ValidateSummaryResult,
} from "./ValidateAccordionItem-types";

/*
 * Validates the chevron, the `span` DetachedContext next to the summary's NestedEditable. It has no attributes. Its
 * shadow tree (the icon) is left to the Sanitizer.
 */
const validateChevron = ({
	componentDraft,
	detachedContextDraft,
}: ValidateChevronParams): ValidateChevronResult => {
	const { editorRole, localName, customStorage } = detachedContextDraft;

	const state: DetachedContextState = { editorRole, localName, customStorage };

	const mismatch = matchJSON({
		value: state,
		pattern: {
			editorRole: detachedContextRole,
			localName: "span",
			customStorage: null,
		},
	});

	if (mismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: detachedContextDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: detachedContextDraft,
				value: state,
				mismatch,
			}),
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

	return null;
};

/*
 * Validates the summary and its children: the single-line NestedEditable, then the chevron. The NestedEditable's content
 * is left to the engine's validation.
 */
const validateSummary = ({
	componentDraft,
	htmlLayoutDraft,
}: ValidateSummaryParams): ValidateSummaryResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "summary",
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

	const [nestedEditableDraft, detachedContextDraft] = childNodes;

	if (
		childNodes.length !== 2 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole ||
		detachedContextDraft?.editorRole !== detachedContextRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain a ${nestedEditableRole}, then a ${detachedContextRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "block single-line",
			editState: "inherit",
			allowedComponents: null,
			allowedContentLineLocalNames: null,
			allowedContentLineStyleAttrNames: null,
			allowedGlyphFormatterStyleAttrNames: null,
			allowedGlyphFormatterInlineTags: null,
			domAttrs: {},
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	const chevronFailed = validateChevron({
		componentDraft,
		detachedContextDraft,
	});

	if (chevronFailed) {
		return chevronFailed;
	}

	return null;
};

/*
 * Validates the details and its children: the summary, then the multi-line NestedEditable of the body. The details'
 * domAttrs are resolved by the AccordionItem's details shape and validators. The NestedEditable's content is left to
 * the engine's validation.
 */
const validateDetails = ({
	componentDraft,
	htmlLayoutDraft,
	attrValidators,
}: ValidateDetailsParams): ValidateDetailsResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "details",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: accordionItemAttrsShape.details,
		elementAttrValidators: attrValidators.details,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const [summaryDraft, nestedEditableDraft] = childNodes;

	if (
		childNodes.length !== 2 ||
		summaryDraft?.editorRole !== htmlLayoutRole ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain a summary, then a ${nestedEditableRole}.`,
		};
	}

	const summaryFailed = validateSummary({
		componentDraft,
		htmlLayoutDraft: summaryDraft,
	});

	if (summaryFailed) {
		return summaryFailed;
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "block multi-line",
			editState: "inherit",
			allowedComponents: null,
			allowedContentLineLocalNames: null,
			allowedContentLineStyleAttrNames: null,
			allowedGlyphFormatterStyleAttrNames: null,
			allowedGlyphFormatterInlineTags: null,
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
 * Validates an AccordionItem, its BlockComponentLine, and everything down to its NestedEditables, node by node: each
 * node's own state, then its children. It's built as a BlockComponent holding a details, which holds a summary (the
 * single-line NestedEditable and the chevron) and the multi-line NestedEditable of the body. The line's and the
 * details' domAttrs are resolved by the given validators, every other node's by an empty shape. The NestedEditables'
 * content is left to the engine's validation.
 */
const validateAccordionItem = ({
	componentDraft,
	attrValidators,
}: ValidateAccordionItemParams): ValidateAccordionItemResult => {
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
			name: componentsName.accordionItem,
			content: { type: "custom" },
			editState: "inherit",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: false,
			customStorage: accordionItemStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape: accordionItemAttrsShape.line,
		lineAttrValidators: attrValidators.line,
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

	const detailsFailed = validateDetails({
		componentDraft,
		htmlLayoutDraft,
		attrValidators,
	});

	if (detailsFailed) {
		return detailsFailed;
	}

	return null;
};

/*
 * Creates the AccordionItem's ComponentValidator, which validates the AccordionItems' attributes by the default
 * validators, replaced by the given ones (see createAccordionItemAttrValidators).
 */
export const createAccordionItemValidator = ({
	attrValidators = {},
}: CreateAccordionItemValidatorParams): CreateAccordionItemValidatorResult => {
	const accordionItemAttrValidators =
		createAccordionItemAttrValidators(attrValidators);

	return {
		name: componentsName.accordionItem,
		validate: ({ componentDraft }) =>
			validateAccordionItem({
				componentDraft,
				attrValidators: accordionItemAttrValidators,
			}),
	};
};
