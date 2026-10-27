export type ObjectFitValue = "cover" | "contain" | "fill";

export const objectFitAttrName = "data-object-fit";

export const isObjectFitValue = (
	value: string | null,
): value is ObjectFitValue =>
	value === "cover" || value === "contain" || value === "fill";
