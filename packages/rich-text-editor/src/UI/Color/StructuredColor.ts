export interface SolidColor {
	type: "solid";
	value: string;
}

export interface LinearGradientColor {
	type: "linear-gradient";
	deg: number;
	colors: { value: string; offset: number }[];
}

export type StructuredColor = SolidColor | LinearGradientColor;
