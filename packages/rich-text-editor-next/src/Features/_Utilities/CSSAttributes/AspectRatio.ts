export type AspectRatioValue = "auto" | "1-1" | "4-3" | "16-9";

export const aspectRatioAttrName = "data-aspect-ratio";

const isAspectRatioValue = (value: string | null): value is AspectRatioValue =>
	value === "auto" || value === "1-1" || value === "4-3" || value === "16-9";

export const getAspectRatio = (
	element: Element | null,
): AspectRatioValue | null => {
	const value = element?.getAttribute(aspectRatioAttrName) ?? null;

	return isAspectRatioValue(value) ? value : null;
};

export const setAspectRatio = (
	element: Element,
	aspectRatio: AspectRatioValue,
) => {
	element.setAttribute(aspectRatioAttrName, aspectRatio);
};
