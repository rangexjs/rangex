import type { ComponentAttrsShape } from "../DOMAttrs-types";
import { validateElementAttrs } from "../ValidateElementAttrs";
import type {
	ValidateComponentAttrsParams,
	ValidateComponentAttrsResult,
} from "./ValidateComponentAttrs-types";

/*
 * Validates every element's attributes of a component (see validateElementAttrs). Returns the first mismatch with its
 * element's name, or null when the attributes are valid.
 */
export const validateComponentAttrs = <TComponentAttrsShape extends ComponentAttrsShape>({
	componentAttrs,
	componentAttrsShape,
	componentAttrValidators,
}: ValidateComponentAttrsParams<TComponentAttrsShape>): ValidateComponentAttrsResult<TComponentAttrsShape> => {
	for (const elementName in componentAttrsShape) {
		const mismatch = validateElementAttrs({
			elementAttrs: componentAttrs[elementName],
			elementAttrsShape: componentAttrsShape[elementName],
			elementAttrValidators: componentAttrValidators[elementName],
		});

		if (mismatch) {
			return { elementName, mismatch };
		}
	}

	return null;
};
