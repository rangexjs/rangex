import {
	htmlLayoutRole,
	inlineComponentRole,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createLinkAttrValidators, linkAttrsShape } from "#dom-attrs";
import { linkStoragePattern } from "#storage";
import {
	formatNodePath,
	resolveDraftDOMAttrs,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateInlineComponentState } from "../_Utilities";
import type {
	CreateLinkValidatorParams,
	CreateLinkValidatorResult,
	ValidateAnchorParams,
	ValidateAnchorResult,
	ValidateLinkParams,
	ValidateLinkResult,
} from "./ValidateLink-types";

/*
 * Validates the Link's anchor and, through its only child, its NestedEditable. The anchor's domAttrs are resolved by
 * linkAttrsShape and the anchor's validators (see resolveElementAttrs), and replaced by the resolved ones.
 */
const validateAnchor = ({
	componentDraft,
	htmlLayoutDraft,
	anchorAttrValidators,
}: ValidateAnchorParams): ValidateAnchorResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "a",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: linkAttrsShape.anchor,
		elementAttrValidators: anchorAttrValidators,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const nestedEditableDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
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
			display: "inline",
			editState: "inherit",
			allowedComponents: [],
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
 * Validates a Link and everything down to its NestedEditable, node by node: each node's own state, then its children.
 * The NestedEditable's content is left to the engine's validation, which checks it by the NestedEditable's settings.
 */
const validateLink = ({
	componentDraft,
	attrValidators,
}: ValidateLinkParams): ValidateLinkResult => {
	if (componentDraft.editorRole !== inlineComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be an ${inlineComponentRole}.`,
		};
	}

	const stateFailed = validateInlineComponentState({
		inlineComponentDraft: componentDraft,
		expectedState: {
			editorRole: inlineComponentRole,
			name: componentsName.link,
			content: { type: "bound-text", unwrap: "if-empty" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			domAttrs: {},
			customStorage: linkStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
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

	const anchorFailed = validateAnchor({
		componentDraft,
		htmlLayoutDraft,
		anchorAttrValidators: attrValidators.anchor,
	});

	if (anchorFailed) {
		return anchorFailed;
	}

	return null;
};

/*
 * Creates the Link's ComponentValidator, which validates the Links' attributes by the default validators, replaced by
 * the given ones (see createLinkAttrValidators).
 */
export const createLinkValidator = ({
	attrValidators = {},
}: CreateLinkValidatorParams): CreateLinkValidatorResult => {
	const linkAttrValidators = createLinkAttrValidators(attrValidators);

	return {
		name: componentsName.link,
		validate: ({ componentDraft }) =>
			validateLink({ componentDraft, attrValidators: linkAttrValidators }),
	};
};
