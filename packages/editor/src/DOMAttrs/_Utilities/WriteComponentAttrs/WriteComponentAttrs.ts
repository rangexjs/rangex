import type { ComponentAttrsShape } from "../DOMAttrs-types";
import { writeElementAttrs } from "../WriteElementAttrs";
import type { WriteComponentAttrsParams } from "./WriteComponentAttrs-types";

/*
 * Writes every element's attributes of a component (see writeElementAttrs).
 */
export const writeComponentAttrs = <TComponentAttrsShape extends ComponentAttrsShape>({
	componentElements,
	componentAttrs,
}: WriteComponentAttrsParams<TComponentAttrsShape>) => {
	for (const elementName in componentAttrs) {
		writeElementAttrs({
			element: componentElements[elementName],
			elementAttrs: componentAttrs[elementName],
		});
	}
};
