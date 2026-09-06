import type { Accessor, Setter } from "solid-js";
import type { HslFormat } from "#color";

export type ColorType = "HSL" | "RGB" | "Hex";

export interface ColorFormatButtonProps {
	colorFormat: Accessor<ColorType>;
	setColorFormat: Setter<ColorType>;
	class?: string;
}

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
