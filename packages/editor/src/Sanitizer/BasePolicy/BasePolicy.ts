import type { AttributeRuleFn, SanitizerPolicy } from "@rangex/core";
import { isDataImageURL, isSafeURL } from "#utilities";

// The attributes an animation can't target: animating them would set a URL or an event handler the rules never see
const blockedAnimationTargets = new Set(["href", "xlink:href"]);

const isAllowed: AttributeRuleFn = () => true;

const isBlocked: AttributeRuleFn = () => false;

const isSafeURLValue: AttributeRuleFn = ({ value }) => isSafeURL(value);

// "data:image/*" URLs are only safe where the browser renders them as an image
const isSafeImageURLValue: AttributeRuleFn = ({ value }) =>
	isSafeURL(value) || isDataImageURL(value);

const isSafeAnimationTarget: AttributeRuleFn = ({ value }) => {
	const attrName = value.trim().toLowerCase();

	if (attrName.startsWith("on")) {
		return false;
	}

	return !blockedAnimationTargets.has(attrName);
};

/*
 * Only blocks what could cause XSS: every attribute of a script, the attributes that load or run code, and the URL
 * attributes' unsafe protocols. Every other attribute is allowed, as validateSnapshot only accepts the attributes the
 * components define.
 * The rules judge each attribute alone, so a rule that depends on another attribute (e.g. an animation's target) blocks
 * the attribute that names it.
 */
export const basePolicy: SanitizerPolicy = {
	"*": {
		"*": isAllowed,
	},
	html: {
		"*": {
			href: isSafeURLValue,
			src: isSafeURLValue,
			action: isSafeURLValue,
			formaction: isSafeURLValue,
			data: isSafeURLValue,
			poster: isSafeURLValue,
		},
		script: {
			"*": isBlocked,
		},
		iframe: {
			srcdoc: isBlocked,
		},
		meta: {
			// A refresh redirects the page
			"http-equiv": isBlocked,
		},
		img: {
			src: isSafeImageURLValue,
		},
		video: {
			poster: isSafeImageURLValue,
		},
	},
	svg: {
		"*": {
			href: isSafeURLValue,
			"xlink:href": isSafeURLValue,
			attributeName: isSafeAnimationTarget,
		},
		script: {
			"*": isBlocked,
		},
	},
	mathml: {
		"*": {
			href: isSafeURLValue,
			"xlink:href": isSafeURLValue,
		},
	},
};
