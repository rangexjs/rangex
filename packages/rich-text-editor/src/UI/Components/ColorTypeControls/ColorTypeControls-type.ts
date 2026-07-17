import type { HslFormat } from "../../Color";

export type ColorType = "HSL" | "RGB" | "Hex";

export interface OnColorChangeParams {
	hsl: HslFormat;
}

export type OnColorChangeFn = (params: OnColorChangeParams) => void;

export interface ColorTypeControlsParams {
	hsl: HslFormat;
	onColorChange: OnColorChangeFn;
	buttonContainerClass?: string;
	colorContainerClass?: string;
}
