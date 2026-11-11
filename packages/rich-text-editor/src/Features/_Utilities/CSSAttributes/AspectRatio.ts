export type AspectRatioValue = `${number} / ${number}`;

export const aspectRatioAttrName = "data-aspect-ratio";

const aspectRatioPattern = /^\d+(?:\.\d+)? \/ \d+(?:\.\d+)?$/;

export const isAspectRatioValue = (
	value: string | null,
): value is AspectRatioValue =>
	value !== null && aspectRatioPattern.test(value);
