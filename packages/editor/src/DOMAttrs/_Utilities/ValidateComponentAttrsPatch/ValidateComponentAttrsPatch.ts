import type { ComponentAttrsShape } from "../DOMAttrs-types";
import { validateElementAttrsPatch } from "../ValidateElementAttrsPatch";
import type {
	ValidateComponentAttrsPatchParams,
	ValidateComponentAttrsPatchResult,
} from "./ValidateComponentAttrsPatch-types";

/*
 * Validates only the given attributes of a component (see validateElementAttrsPatch): an element left out isn't checked.
 * Returns the first mismatch with its element's name, or null when the attributes are valid.
 */
export const validateComponentAttrsPatch = <TComponentAttrsShape extends ComponentAttrsShape>({
	componentAttrsPatch,
	componentAttrsShape,
	componentAttrValidators,
}: ValidateComponentAttrsPatchParams<TComponentAttrsShape>): ValidateComponentAttrsPatchResult<TComponentAttrsShape> => {
	for (const elementName in componentAttrsShape) {
		const elementAttrsPatch = componentAttrsPatch[elementName];

		if (!elementAttrsPatch) {
			continue;
		}

		const mismatch = validateElementAttrsPatch({
			elementAttrsPatch,
			elementAttrsShape: componentAttrsShape[elementName],
			elementAttrValidators: componentAttrValidators[elementName],
		});

		if (mismatch) {
			return { elementName, mismatch };
		}
	}

	return null;
};
