// Designed for BlockNestedContextLine
export const blockAlignAttr = {
	name: "data-block-align",
	value: { left: "left", center: "center", right: "right" },
} as const;

// Designed for BlockComponent, the value is a width in px without its unit (e.g. "640")
export const blockWidthAttr = {
	name: "data-block-width",
} as const;

// Universal
export const objectFitAttr = {
	name: "data-object-fit",
	value: { cover: "cover", contain: "contain", fill: "fill" },
} as const;

// Universal
export const aspectRatioAttr = {
	name: "data-aspect-ratio",
	value: { auto: "auto", "1-1": "1-1", "4-3": "4-3", "16-9": "16-9" },
} as const;
