export const blockAlignAttr = {
	name: "data-block-align",
	value: { left: "left", center: "center", right: "right" },
} as const;

export const imageObjectFitAttr = {
	name: "data-object-fit",
	value: { cover: "cover", contain: "contain", fill: "fill" },
} as const;

export const imageAspectRatioAttr = {
	name: "data-aspect-ratio",
	value: { auto: "auto", "1-1": "1-1", "4-3": "4-3", "16-9": "16-9" },
} as const;
