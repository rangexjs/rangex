export interface HslFormat {
	h: number;
	s: number;
	l: number;
	a: number;
}

export interface RgbFormat {
	r: number;
	g: number;
	b: number;
	a: number;
}

export interface HexFormat {
	hex: string;
}

export interface IsValidHslParams extends HslFormat {}

export type IsValidHslResult = boolean;

export interface IsValidRgbParams extends RgbFormat {}

export type IsValidRgbResult = boolean;

export interface IsValidHexParams extends HexFormat {}

export type IsValidHexResult = boolean;

export interface HslToColorParams extends HslFormat {}

export type HslToColorResult =
	`hsl(${number}deg, ${number}%, ${number}%, ${number})`;

export interface HslToRgbParams extends HslFormat {}

export interface HslToRgbResult extends RgbFormat {}

export interface HslToHexParams extends HslFormat {}

export interface HslToHexResult extends HexFormat {}

export interface RgbToHslParams extends RgbFormat {}

export interface RgbToHslResult extends HslFormat {}

export interface HexToHslParams extends HexFormat {}

export interface HexToHslResult extends HslFormat {}

export interface GetHslFormatFromColorParams {
	color: string;
}

export interface GetHslFormatFromColorResult extends HslFormat {}

// Color
// color-hsl
export type ColorFormatHslIsValidResult = IsValidHslResult;

export type ColorFormatHslColorResult = HslToColorResult;

export interface ColorFormatHslRgbParams {
	round: boolean;
}

export interface ColorFormatHslRgbResult extends RgbFormat {}

export interface ColorFormatHslHexResult extends HslToHexResult {}

export interface ColorFormatHslParams extends HslFormat {}

export interface ColorFormatHslResult {
	isValid: () => ColorFormatHslIsValidResult;
	color: () => ColorFormatHslColorResult;
	rgb: (params: ColorFormatHslRgbParams) => ColorFormatHslRgbResult;
	hex: () => ColorFormatHslHexResult;
}

// color-rgb
export type ColorFormatRgbIsValidResult = IsValidHexResult;

export interface ColorFormatRgbHslParams {
	round?: boolean;
}

export interface ColorFormatRgbHslResult extends HslFormat {}

export interface ColorFormatRgbParams extends RgbFormat {}

export interface ColorFormatRgbResult {
	isValid: () => ColorFormatRgbIsValidResult;
	hsl: (params: ColorFormatRgbHslParams) => ColorFormatRgbHslResult;
}

// color-hex
export type ColorFormatHexIsValidResult = IsValidHexResult;

export interface ColorFormatHexHslParams {
	round?: boolean;
}

export interface ColorFormatHexHslResult extends HexToHslResult {}

export interface ColorFormatHexParams extends HexFormat {}

export interface ColorFormatHexResult {
	isValid: () => ColorFormatHexIsValidResult;
	hsl: (params: ColorFormatHexHslParams) => ColorFormatHexHslResult;
}

// color-rest
export interface ColorFormatFromColorParams
	extends GetHslFormatFromColorParams {}
