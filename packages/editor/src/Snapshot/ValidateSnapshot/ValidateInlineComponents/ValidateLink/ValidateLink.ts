import {
	htmlLayoutRole,
	inlineComponentRole,
	nestedEditableRole,
} from "@rangex/core";
import { validateDOMAttrs } from "#attr-rules";
import { createLinkStorage } from "#storage";
import { matchJSON } from "#utilities";
// Not from "#engine-links": its other modules need a DOM, and the validation must run on a server
import { componentsName } from "../../../../EngineLinks/Constants/ComponentsName";
import {
	describeDOMAttrsMismatch,
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
 * Validates the Link's anchor (its domAttrs by the anchor's AttrRules) and, through its only child, its NestedEditable.
 */
const validateAnchor = ({
	linkDraft,
	htmlLayoutDraft,
	anchorAttrRules,
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

	const domAttrsMismatch = validateDOMAttrs({
		domAttrs,
		attrRules: anchorAttrRules,
	});

	if (domAttrsMismatch) {
		return {
			sourceSnapshot: linkDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: describeDOMAttrsMismatch({
				componentDraft: linkDraft,
				nodeDraft: htmlLayoutDraft,
				domAttrs,
				mismatch: domAttrsMismatch,
			}),
		};
	}

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
	attrRules,
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
		anchorAttrRules: attrRules.anchor,
	});

	if (anchorFailed) {
		return anchorFailed;
	}

	return null;
};

/*
 * Creates the Link's ComponentValidator, which validates the Links' attributes by the given AttrRules (see
 * createLinkAttrRules).
 */
export const createLinkValidator = ({
	attrRules,
}: CreateLinkValidatorParams): CreateLinkValidatorResult => ({
	name: componentsName.link,
	validate: ({ componentDraft }) => validateLink({ componentDraft, attrRules }),
});
