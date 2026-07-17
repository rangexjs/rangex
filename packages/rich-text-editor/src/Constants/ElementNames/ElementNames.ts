import type { ElementName } from "./ElementNames-types";

export const elementNameAttr = "data-name" as const;

export const todoCheckboxElementName = "todo-checkbox" as const;

export const createElementNameSelector = <Value extends ElementName>(
	value: Value,
) => `[${elementNameAttr}="${value}"]` as const;

export const isElementNameMatch = (name: ElementName, el: Element) => {
	const value = el.getAttribute(elementNameAttr);

	return value === name;
};
