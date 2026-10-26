export type AspectRatioValue = `${number} / ${number}`;

export const aspectRatioAttrName = "data-aspect-ratio";

const aspectRatioPattern = /^\d+(?:\.\d+)? \/ \d+(?:\.\d+)?$/;

export const isAspectRatioValue = (
	value: string | null,
): value is AspectRatioValue =>
	value !== null && aspectRatioPattern.test(value);

/*
 * Reads an element's aspect ratio, null if it has none (or an invalid one, which the styles ignore too).
 */
export const getAspectRatio = (
	element: Element | null,
): AspectRatioValue | null => {
	const value = element?.getAttribute(aspectRatioAttrName) ?? null;

	return isAspectRatioValue(value) ? value : null;
};

/*
 * Sets an element's aspect ratio, or removes it (null), so the element keeps its component's default ratio.
 */
export const setAspectRatio = (
	element: Element,
	aspectRatio: AspectRatioValue | null,
) => {
	if (aspectRatio === null) {
		element.removeAttribute(aspectRatioAttrName);
		return;
	}

	element.setAttribute(aspectRatioAttrName, aspectRatio);
};
