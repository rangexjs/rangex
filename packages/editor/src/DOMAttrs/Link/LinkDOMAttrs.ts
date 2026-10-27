import { htmlLayoutRole, xhtmlNamespaceURI } from "@rangex/core";
import { isSafeURL } from "#utilities";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateTitle,
} from "../_Utilities";
import type {
	CreateLinkAttrValidatorsParams,
	CreateLinkAttrValidatorsResult,
	LinkAttrs,
} from "./LinkDOMAttrs-types";

const anchorAttrsShape = {
	href: "required",
	target: "optional",
	rel: "optional",
	title: "optional",
} as const satisfies ElementAttrsShape;

const anchorElement: ElementDescriptor = {
	localName: "a",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const linkAttrsShape = {
	anchor: anchorAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * An href is valid if it isn't empty, it's at most 8192 characters long, a safe URL (see isSafeURL), and a relative one
 * stays on the page's host. An invalid one falls back to "#".
 */
const validateHref: ValidateAttrFn<string> = ({ value }) => {
	const baseURL = "https://base.invalid/";
	const baseHost = "base.invalid";
	const maxHrefLength = 8192;
	const hrefFallback = "#";

	if (value.trim() === "") {
		return {
			kind: "fallback",
			reason: "must not be empty",
			value: hrefFallback,
		};
	}

	if (value.length > maxHrefLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxHrefLength} characters long`,
			value: hrefFallback,
		};
	}

	if (!isSafeURL(value)) {
		return {
			kind: "fallback",
			reason: "must be a safe URL",
			value: hrefFallback,
		};
	}

	const isAbsolute = URL.canParse(value);

	if (isAbsolute) {
		return null;
	}

	const resolvedURL = new URL(value, baseURL);

	if (resolvedURL.host !== baseHost) {
		return {
			kind: "fallback",
			reason: "must stay on the page's host",
			value: hrefFallback,
		};
	}

	return null;
};

const validateTarget: ValidateAttrFn<string | null> = ({ value }) => {
	const allowedTargets = new Set(["_blank", "_self"]);

	if (!allowedTargets.has(value)) {
		return {
			kind: "fallback",
			reason: 'must be "_blank" or "_self"',
			value: null,
		};
	}

	return null;
};

/*
 * A rel is valid if it has at least one token, and each of them is allowed and only listed once.
 */
const validateRel: ValidateAttrFn<string | null> = ({ value }) => {
	const allowedRelTokens = new Set([
		"noopener",
		"noreferrer",
		"nofollow",
		"ugc",
		"sponsored",
	]);

	const tokens = value.split(/\s+/);
	const nonEmptyTokens = tokens.filter((token) => token !== "");

	if (!nonEmptyTokens.length) {
		return {
			kind: "fallback",
			reason: "must contain at least one token",
			value: null,
		};
	}

	const uniqueTokens = new Set(nonEmptyTokens);

	if (uniqueTokens.size !== nonEmptyTokens.length) {
		return { kind: "fallback", reason: "must not repeat a token", value: null };
	}

	for (const token of uniqueTokens) {
		if (!allowedRelTokens.has(token)) {
			return {
				kind: "fallback",
				reason: `must only contain ${[...allowedRelTokens].join(", ")}`,
				value: null,
			};
		}
	}

	return null;
};

/*
 * Trims the href, and prefixes it with "https://" if it has neither a scheme nor a relative prefix (e.g. "example.com").
 */
const normalizeHref = (href: string) => {
	// An href starting with one of them is kept as it is, any other one is taken as an https URL without its scheme
	const keptHrefPrefixes = [
		"https://",
		"http://",
		"mailto:",
		"tel:",
		"/",
		"./",
		"../",
		"?",
		"#",
	];

	const trimmedHref = href.trim();

	if (trimmedHref === "") {
		return trimmedHref;
	}

	const lowerCaseHref = trimmedHref.toLowerCase();

	const isKept = keptHrefPrefixes.some((prefix) =>
		lowerCaseHref.startsWith(prefix),
	);

	return isKept ? trimmedHref : `https://${trimmedHref}`;
};

/*
 * Normalizes the Link's attributes before they're validated and written, e.g. "example.com" becomes
 * "https://example.com". The validators receive the normalized values.
 */
export const normalizeLinkAttrs = (linkAttrs: LinkAttrs): LinkAttrs => {
	const { anchor } = linkAttrs;

	const normalizedLinkAttrs: LinkAttrs = {
		anchor: { ...anchor, href: normalizeHref(anchor.href) },
	};

	return normalizedLinkAttrs;
};

/*
 * Creates the Link's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createLinkAttrValidators = (
	validatorOverrides: CreateLinkAttrValidatorsParams,
): CreateLinkAttrValidatorsResult => {
	const linkAttrValidators = createComponentAttrValidators({
		componentAttrsShape: linkAttrsShape,
		elementDescriptors: { anchor: anchorElement },
		defaultValidators: {
			anchor: {
				href: validateHref,
				target: validateTarget,
				rel: validateRel,
				title: validateTitle,
			},
		},
		validatorOverrides,
	});

	return linkAttrValidators;
};
