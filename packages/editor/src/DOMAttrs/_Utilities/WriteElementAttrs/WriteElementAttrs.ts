import type { WriteElementAttrsParams } from "./WriteElementAttrs-types";

/*
 * Sets every attribute that is a string, and removes every one that is null. Goes through the engine's Sanitizer.
 */
export const writeElementAttrs = ({
	element,
	elementAttrs,
}: WriteElementAttrsParams) => {
	for (const [attrName, value] of Object.entries(elementAttrs)) {
		if (value === undefined) {
			continue;
		}

		if (value === null) {
			element.$$removeAttribute(attrName);
			continue;
		}

		element.$$setAttribute(attrName, value);
	}
};
