import type {
	ComponentAttrs,
	ComponentAttrsShape,
	ElementAttrsPatch,
} from "../DOMAttrs-types";
import type {
	MergeComponentAttrsParams,
	MergeComponentAttrsResult,
} from "./MergeComponentAttrs-types";

/*
 * Returns a copy of the component's attributes with the patch applied: a string or null replaces the attribute's
 * value, and an element or attribute left out (or undefined) keeps it.
 */
export const mergeComponentAttrs = <
	TComponentAttrsShape extends ComponentAttrsShape,
>({
	componentAttrs,
	componentAttrsPatch,
}: MergeComponentAttrsParams<TComponentAttrsShape>): MergeComponentAttrsResult<TComponentAttrsShape> => {
	const mergedComponentAttrs = { ...componentAttrs };

	for (const elementName in componentAttrsPatch) {
		const elementAttrsPatch = componentAttrsPatch[elementName];

		if (!elementAttrsPatch) {
			continue;
		}

		const mergedElementAttrs: ElementAttrsPatch<
			TComponentAttrsShape[typeof elementName]
		> = { ...componentAttrs[elementName] };

		for (const attrName in elementAttrsPatch) {
			const value = elementAttrsPatch[attrName];

			if (value === undefined) {
				continue;
			}

			mergedElementAttrs[attrName] = value;
		}

		mergedComponentAttrs[elementName] =
			mergedElementAttrs as ComponentAttrs<TComponentAttrsShape>[typeof elementName];
	}

	return mergedComponentAttrs;
};
