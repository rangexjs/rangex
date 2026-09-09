export type ObjectFitValue = "cover" | "contain" | "fill";

export const objectFitAttrName = "data-object-fit";

const isObjectFitValue = (value: string | null): value is ObjectFitValue =>
	value === "cover" || value === "contain" || value === "fill";

export const getObjectFit = (
	element: Element | null,
): ObjectFitValue | null => {
	const value = element?.getAttribute(objectFitAttrName) ?? null;

	return isObjectFitValue(value) ? value : null;
};

export const setObjectFit = (element: Element, objectFit: ObjectFitValue) => {
	element.setAttribute(objectFitAttrName, objectFit);
};
