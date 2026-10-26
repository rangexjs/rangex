import {
	htmlLayoutRole,
	inlineComponentRole,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName } from "#constants";
import {
	createLinkAttrValidators,
	linkAttrsShape,
	resolveElementAttrs,
} from "#dom-attrs";
import { createLinkStorage } from "#storage";
import { matchJSON } from "#utilities";
import {
	describeElementAttrsMismatch,
	describeJSONMismatch,
	formatNodePath,
} from "../../_Utilities";
import { validateInlineComponentState } from "../_Utilities";
import type {
	AnchorState,
	CreateLinkValidatorParams,
	CreateLinkValidatorResult,
	NestedEditableState,
	ValidateAnchorParams,
	ValidateAnchorResult,
	ValidateLinkParams,
	ValidateLinkResult,
	ValidateNestedEditableParams,
	ValidateNestedEditableResult,
} from "./ValidateLink-types";

const validateNestedEditable = ({
	linkDraft,
	nestedEditableDraft,
}: ValidateNestedEditableParams): ValidateNestedEditableResult => {
	const {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		domAttrs,
		customStorage,
	} = nestedEditableDraft;

	const nestedEditableState: NestedEditableState = {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		domAttrs,
		customStorage,
	};

	const mismatch = matchJSON({
		value: nestedEditableState,
		pattern: {
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

	if (mismatch) {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: nestedEditableDraft,
			reason: describeJSONMismatch({
				componentDraft: linkDraft,
				nodeDraft: nestedEditableDraft,
				value: nestedEditableState,
				mismatch,
			}),
		};
	}

	return null;
};

/*
 * Validates the Link's anchor and, through its only child, its NestedEditable. The anchor's domAttrs are resolved by
 * linkAttrsShape and the anchor's validators (see resolveElementAttrs), and replaced by the resolved ones.
 */
const validateAnchor = ({
	linkDraft,
	htmlLayoutDraft,
	anchorAttrValidators,
}: ValidateAnchorParams): ValidateAnchorResult => {
	const { editorRole, localName, domAttrs, customStorage, childNodes } =
		htmlLayoutDraft;

	const anchorState: AnchorState = {
		editorRole,
		localName,
		customStorage,
	};

	const mismatch = matchJSON({
		value: anchorState,
		pattern: {
			editorRole: htmlLayoutRole,
			localName: "a",
			customStorage: null,
		},
	});

	if (mismatch) {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: describeJSONMismatch({
				componentDraft: linkDraft,
				nodeDraft: htmlLayoutDraft,
				value: anchorState,
				mismatch,
			}),
		};
	}

	const resolvedDOMAttrs = resolveElementAttrs({
		elementAttrs: domAttrs,
		elementAttrsShape: linkAttrsShape.anchor,
		elementAttrValidators: anchorAttrValidators,
	});

	if (resolvedDOMAttrs.kind === "invalid") {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: describeElementAttrsMismatch({
				componentDraft: linkDraft,
				nodeDraft: htmlLayoutDraft,
				domAttrs,
				mismatch: resolvedDOMAttrs.mismatch,
			}),
		};
	}

	htmlLayoutDraft.domAttrs = resolvedDOMAttrs.elementAttrs;

	const nestedEditableDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ componentDraft: linkDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${nestedEditableRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditable({
		linkDraft,
		nestedEditableDraft,
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
			reason: `${formatNodePath({ componentDraft, nodeDraft: componentDraft })}: must be an ${inlineComponentRole}.`,
		};
	}

	const linkDraft = componentDraft;

	const stateFailed = validateInlineComponentState({
		inlineComponentDraft: linkDraft,
		expectedState: {
			editorRole: inlineComponentRole,
			name: componentsName.link,
			content: { type: "bound-text", unwrap: "if-empty" },
			editState: "inherit",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			domAttrs: {},
			customStorage: createLinkStorage(),
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const { childNodes } = linkDraft;

	const htmlLayoutDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		htmlLayoutDraft?.editorRole !== htmlLayoutRole
	) {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: linkDraft,
			reason: `${formatNodePath({ componentDraft: linkDraft, nodeDraft: linkDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const anchorFailed = validateAnchor({
		linkDraft,
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
