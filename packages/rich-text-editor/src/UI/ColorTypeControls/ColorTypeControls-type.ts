import type { JSX } from "@solidjs/web";
import type { Accessor, Setter } from "solid-js";

import type { HslFormat } from "#color";

export type ColorType = "HSL" | "RGB" | "Hex";

export interface ColorFormatButtonProps {
	colorFormat: Accessor<ColorType>;
	setColorFormat: Setter<ColorType>;
	class?: JSX.ClassValue;
}

export interface OnColorChangeParams {
	hsl: HslFormat;
}

export type OnColorChangeFn = (params: OnColorChangeParams) => void;

export interface ColorTypeControlsParams {
	hsl: HslFormat;
	onColorChange: OnColorChangeFn;
	buttonContainerClass?: JSX.ClassValue;
	colorContainerClass?: JSX.ClassValue;
}
