// Designed for BlockComponentLine
export const blockAlignAttr = {
	name: "data-block-align",
	value: { left: "left", center: "center", right: "right" },
} as const;

// Designed for BlockComponent, the value is a width in px without its unit (e.g. "640")
export const blockWidthAttr = {
	name: "data-block-width",
} as const;

// Designed for a TableCell's NestedEditable, the value is its align-content
export const verticalAlignAttr = {
	name: "data-vertical-align",
	value: { start: "start", center: "center", end: "end" },
} as const;

// Universal
export const objectFitAttr = {
	name: "data-object-fit",
	value: { cover: "cover", contain: "contain", fill: "fill" },
} as const;

// Universal, the value is a ratio (e.g. "16 / 9")
export const aspectRatioAttr = {
	name: "data-aspect-ratio",
} as const;
