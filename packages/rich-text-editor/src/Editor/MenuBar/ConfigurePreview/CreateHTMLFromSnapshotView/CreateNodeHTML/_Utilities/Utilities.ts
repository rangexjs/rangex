import type { SetAttributesParams } from "./Utilities-types";

export const setAttributes = ({
	element,
	attributes,
}: SetAttributesParams): void => {
	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key, value);
	}
};
