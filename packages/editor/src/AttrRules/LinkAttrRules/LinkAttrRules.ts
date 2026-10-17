import { isSafeURL } from "#utilities";
import type { AttrRule } from "../AttrRules-types";
import type {
	AnchorAttrRules,
	CreateLinkAttrRulesParams,
	CreateLinkAttrRulesResult,
} from "./LinkAttrRules-types";

// Resolves the relative hrefs, so a protocol-relative one ("//host") shows up as another host
const baseURL = "https://base.invalid/";

const baseHost = "base.invalid";

const maxHrefLength = 2048;

/*
 * An href is valid if it's at most 2048 characters long, a safe URL (see isSafeURL), and a relative one stays on the
 * page's host.
 */
const hrefRule: AttrRule = {
	required: true,
	validate: ({ value }) => {
		if (value.length > maxHrefLength) {
			return {
				reason: `must be at most ${maxHrefLength} characters long`,
				fallback: null,
			};
		}

		if (!isSafeURL(value)) {
			return { reason: "must be a safe URL", fallback: null };
		}

		const isAbsolute = URL.canParse(value);

		if (isAbsolute) {
			return null;
		}

		const resolvedURL = new URL(value, baseURL);

		if (resolvedURL.host !== baseHost) {
			return { reason: "must stay on the page's host", fallback: null };
		}

		return null;
	},
};

const targetRule: AttrRule = {
	required: false,
	validate: ({ value }) => {
		if (value !== "_blank") {
			return { reason: 'must be "_blank"', fallback: null };
		}

		return null;
	},
};

const anchorAttrRules: AnchorAttrRules = {
	href: hrefRule,
	target: targetRule,
};

/*
 * Creates the Link's AttrRules: each node's default rules, overridden by the given ones. A given rule replaces the
 * default of the same attribute or adds a new one; an undefined one removes it, so its attribute becomes invalid.
 */
export const createLinkAttrRules = ({
	anchor,
}: CreateLinkAttrRulesParams): CreateLinkAttrRulesResult => {
	const mergedAttrRules: CreateLinkAttrRulesResult = {
		anchor: { ...anchorAttrRules, ...anchor },
	};

	return mergedAttrRules;
};
