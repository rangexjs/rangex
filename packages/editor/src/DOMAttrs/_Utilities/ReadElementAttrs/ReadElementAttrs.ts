import type { ElementAttrsShape } from "../DOMAttrs-types";
import type { ReadElementAttrsParams, ReadElementAttrsResult } from "./ReadElementAttrs-types";

/*
 * Reads the element's attributes that are in its shape. An attribute that isn't set is null.
 */
export const readElementAttrs = <TElementAttrsShape extends ElementAttrsShape>({
	element,
	elementAttrsShape,
}: ReadElementAttrsParams<TElementAttrsShape>): ReadElementAttrsResult<TElementAttrsShape> => {
	const elementAttrs: Record<string, string | null> = {};

	for (const [attrName, requirement] of Object.entries(elementAttrsShape)) {
		const value = element.getAttribute(attrName);

		const valueByRequirement = {
			required: value ?? "",
			optional: value,
		};

		elementAttrs[attrName] = valueByRequirement[requirement];
	}

	// Has one value for each attribute of the shape, typed by its requirement
	return elementAttrs as ReadElementAttrsResult<TElementAttrsShape>;
};
