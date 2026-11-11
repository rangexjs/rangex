import type { ComponentAttrsShape } from "../DOMAttrs-types";
import { readElementAttrs } from "../ReadElementAttrs";
import type {
	ReadComponentAttrsParams,
	ReadComponentAttrsResult,
} from "./ReadComponentAttrs-types";

/*
 * Reads every element's attributes of a component (see readElementAttrs).
 */
export const readComponentAttrs = <
	TComponentAttrsShape extends ComponentAttrsShape,
>({
	componentElements,
	componentAttrsShape,
}: ReadComponentAttrsParams<TComponentAttrsShape>): ReadComponentAttrsResult<TComponentAttrsShape> => {
	// Filled below with one entry for each element of the shape
	const componentAttrs = {} as ReadComponentAttrsResult<TComponentAttrsShape>;

	for (const elementName in componentAttrsShape) {
		componentAttrs[elementName] = readElementAttrs({
			element: componentElements[elementName],
			elementAttrsShape: componentAttrsShape[elementName],
		});
	}

	return componentAttrs;
};
