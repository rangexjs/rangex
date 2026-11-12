import type { DOMAttrs } from "@rangex/core";

import type { AnyElementAttrs } from "../DOMAttrs-types";

/*
 * Converts an element's attributes into the engine's DOMAttrs, leaving out the ones that aren't set (null).
 */
export const toDOMAttrs = (elementAttrs: AnyElementAttrs): DOMAttrs => {
	const domAttrs: DOMAttrs = {};

	for (const [attrName, value] of Object.entries(elementAttrs)) {
		if (value === undefined || value === null) {
			continue;
		}

		domAttrs[attrName] = value;
	}

	return domAttrs;
};
