import {
	htmlLayoutRole,
	inlineComponentRole,
	nestedEditableRole,
} from "@rangex/core";
import { createLinkStorage } from "#storage";
import { isSafeURL, matchJSON, optional } from "#utilities";
// Not from "#engine-links": its other modules need a DOM, and the validation must run on a server
import { componentsName } from "../../../../EngineLinks/Constants/ComponentsName";
import { describeJSONMismatch, formatNodePath } from "../../_Utilities";
import type { ComponentValidator } from "../../ValidateSnapshot-types";
import { validateInlineComponentState } from "../_Utilities";
import type {
	AnchorState,
	NestedEditableState,
	ValidateAnchorParams,
	ValidateAnchorResult,
	ValidateLinkParams,
	ValidateLinkResult,
	ValidateNestedEditableParams,
	ValidateNestedEditableResult,
} from "./ValidateLink-types";

// Resolves the relative hrefs, so a protocol-relative one ("//host") shows up as another host
const baseURL = "https://base.invalid/";

const baseHost = "base.invalid";

const maxHrefLength = 2048;

/*
 * An href is valid if it's a safe URL (see isSafeURL), at most 2048 characters long, and a relative one stays on the
 * page's host.
 */
const isValidHref = (href: string) => {
	if (href.length > maxHrefLength) {
		return false;
	}

	if (!isSafeURL(href)) {
		return false;
	}

	const isAbsolute = URL.canParse(href);

	if (isAbsolute) {
		return true;
	}

	const resolvedURL = new URL(href, baseURL);

	return resolvedURL.host === baseHost;
};

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
 * Validates the Link's anchor and, through its only child, its NestedEditable.
 */
const validateAnchor = ({
	linkDraft,
	htmlLayoutDraft,
}: ValidateAnchorParams): ValidateAnchorResult => {
	const { editorRole, localName, domAttrs, customStorage, childNodes } =
		htmlLayoutDraft;

	const anchorState: AnchorState = {
		editorRole,
		localName,
		domAttrs,
		customStorage,
	};

	const mismatch = matchJSON({
		value: anchorState,
		pattern: {
			editorRole: htmlLayoutRole,
			localName: "a",
			domAttrs: {
				href: (href) => isValidHref(href),
				target: { [optional]: (target) => target === "_blank" },
			},
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
export const validateLink = ({
	componentDraft,
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

	const anchorFailed = validateAnchor({ linkDraft, htmlLayoutDraft });

	if (anchorFailed) {
		return anchorFailed;
	}

	return null;
};

export const linkValidator: ComponentValidator = {
	name: componentsName.link,
	validate: validateLink,
};
