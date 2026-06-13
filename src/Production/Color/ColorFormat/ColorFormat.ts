import { namedColors } from "../NamedColors";
import type {
	ColorFormatFromColorParams,
	ColorFormatHexParams,
	ColorFormatHexResult,
	ColorFormatHslParams,
	ColorFormatHslResult,
	ColorFormatRgbParams,
	ColorFormatRgbResult,
	GetHslFormatFromColorParams,
	GetHslFormatFromColorResult,
	HexToHslParams,
	HexToHslResult,
	HslFormat,
	HslToColorParams,
	HslToColorResult,
	HslToHexParams,
	HslToHexResult,
	HslToRgbParams,
	HslToRgbResult,
	IsValidHexParams,
	IsValidHexResult,
	IsValidHslParams,
	IsValidHslResult,
	IsValidRgbParams,
	IsValidRgbResult,
	RgbFormat,
	RgbToHslParams,
	RgbToHslResult,
} from "./ColorFormat-types";

const isValidHsl = ({ h, s, l, a }: IsValidHslParams): IsValidHslResult => {
	return (
		h < 360 &&
		h >= 0 &&
		s <= 100 &&
		s >= 0 &&
		l <= 100 &&
		l >= 0 &&
		a <= 1 &&
		a >= 0
	);
};

const isValidRgb = ({ r, g, b, a }: IsValidRgbParams): IsValidRgbResult => {
	if (![r, g, b].every((v) => v <= 255 && v >= 0)) {
		return false;
	}

	if (!(a <= 1 && a >= 0)) {
		return false;
	}

	return true;
};

const isValidHex = ({ hex }: IsValidHexParams): IsValidHexResult => {
	const replacedHex = hex.replace(/^#/, "").toLowerCase();

	if (/[^0-9a-f]/.test(replacedHex)) {
		return false;
	}

	const { length } = replacedHex;

	if (![3, 4, 6, 8].some((validLength) => length === validLength)) {
		return false;
	}

	if (!(length === 3 || length === 6 || length === 8)) {
		return false;
	}

	return true;
};

const hslToColor = ({ h, s, l, a }: HslToColorParams): HslToColorResult =>
	`hsl(${h}deg, ${s}%, ${l}%, ${a})`;

/**
 * Converts HSLA to RGBA.
 *
 * https://github.com/w3c/csswg-drafts/blob/61da22ed62e83bf41caa5bde73912209ff45cc2e/css-color-4/hslToRgb.js
 */
const hslToRgb = ({ h, s, l, a = 1 }: HslToRgbParams): HslToRgbResult => {
	if (!isValidHsl({ h, s, l, a })) {
		throw new Error("HSL's value is invalid.");
	}

	s /= 100;
	l /= 100;

	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);

		const percentage = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));

		return percentage * 255;
	};

	return { r: f(0), g: f(8), b: f(4), a };
};

/**
 * Converts HSL to Hex with Alpha.
 */
const hslToHex = ({ h, s, l, a }: HslToHexParams): HslToHexResult => {
	const { r, g, b, a: alpha } = hslToRgb({ h, s, l, a });

	const toHex = (value: number) =>
		Math.round(value).toString(16).padStart(2, "0");

	const alphaHex = Math.round(alpha * 255)
		.toString(16)
		.padStart(2, "0");

	const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}` as const;

	return { hex };
};

/**
 * Converts RGBA to HSLA.
 *
 * https://github.com/w3c/csswg-drafts/blob/61da22ed62e83bf41caa5bde73912209ff45cc2e/css-color-4/rgbToHsl.js
 */
const rgbToHsl = ({ r, g, b, a = 1 }: RgbToHslParams): RgbToHslResult => {
	if (!isValidRgb({ r, g, b, a })) {
		throw new Error("RGB's value is invalid.");
	}

	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let [hue, sat, light] = [0, 0, (min + max) / 2];
	const d = max - min;

	if (d !== 0) {
		sat =
			light === 0 || light === 1
				? 0
				: (max - light) / Math.min(light, 1 - light);

		switch (max) {
			case r:
				hue = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				hue = (b - r) / d + 2;
				break;
			case b:
				hue = (r - g) / d + 4;
		}

		hue *= 60;
	}

	const h = hue;
	const s = sat * 100;
	const l = light * 100;

	return { h, s, l, a };
};

/**
 * Converts Hex to HSLA.
 */
const hexToHsl = ({ hex }: HexToHslParams): HexToHslResult => {
	if (!isValidHex({ hex })) {
		throw new Error("Hex's value is invalid.");
	}

	const replacedHex = hex.replace(/^#/, "");

	const fullHex = (() => {
		if (replacedHex.length === 3 || replacedHex.length === 4) {
			const filledHex = replacedHex.replaceAll(/(.)/g, "$1$1");

			if (filledHex.length === 6) {
				return `${filledHex}ff`;
			}

			return filledHex;
		}

		if (replacedHex.length === 6) {
			return `${replacedHex}ff`;
		}

		return replacedHex;
	})();

	if (fullHex.length !== 8) {
		throw new Error("Hex's value is invalid.");
	}

	const r = Number.parseInt(fullHex.substring(0, 2), 16);
	const g = Number.parseInt(fullHex.substring(2, 4), 16);
	const b = Number.parseInt(fullHex.substring(4, 6), 16);
	const a = Number.parseInt(fullHex.substring(6, 8), 16) / 255; // Convert alpha to [0, 1]

	return rgbToHsl({ r, g, b, a });
};

const normalizeHsl = ({ h, s, l, a }: HslFormat): HslFormat => {
	return {
		h: Math.max(0, h % 360),
		s: Math.max(0, Math.min(100, s)),
		l: Math.max(0, Math.min(100, l)),
		a: Math.max(0, Math.min(1, a)),
	};
};

const normalizeRgb = ({ r, g, b, a }: RgbFormat): RgbFormat => {
	return {
		r: Math.max(0, Math.min(255, r)),
		g: Math.max(0, Math.min(255, g)),
		b: Math.max(0, Math.min(255, b)),
		a: Math.max(0, Math.min(1, a)),
	};
};

const roundHsl = (hsl: HslFormat): HslFormat => {
	const { h, s, l, a } = normalizeHsl(hsl);

	return { h: Math.round(h), s: Math.round(s), l: Math.round(l), a };
};

const roundRgb = (rgb: RgbFormat): RgbFormat => {
	const { r, g, b, a } = normalizeRgb(rgb);

	return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a };
};

const getHSLFormatFromColor = ({
	color,
}: GetHslFormatFromColorParams): GetHslFormatFromColorResult => {
	if (color.startsWith("hsl")) {
		const regex = /([0-1]?(\.\d+)|\d+)/g;

		const matchedColor = color.match(regex);

		if (!matchedColor) {
			throw new Error("HSL's format is invalid.");
		}

		const [hue, saturation, lightness, alpha = "1"] = matchedColor;

		const h = +hue;
		const s = +saturation;
		const l = +lightness;
		const a = +alpha;

		const hslFormat = normalizeHsl({ h, s, l, a });

		if (!isValidHsl(hslFormat)) {
			throw new Error("HSL's value is invalid.");
		}

		return hslFormat;
	}

	if (color.startsWith("rgb")) {
		const regex = /([0-1]?(\.\d+)|\d+)/g;

		const matchedColor = color.match(regex);

		if (!matchedColor) {
			throw new Error("RGB's format is invalid.");
		}

		const [red, green, blue, alpha = "1"] = matchedColor;

		const r = +red;
		const g = +green;
		const b = +blue;
		const a = +alpha;

		return rgbToHsl({ r, g, b, a });
	}

	if (color.startsWith("#")) {
		return hexToHsl({ hex: color });
	}

	const namedColor = namedColors.find(({ name }) => name === color);

	if (namedColor) {
		const { hex } = namedColor;

		return hexToHsl({ hex });
	}

	console.error("Color type couldn't be handled.", color);

	return { h: 0, s: 0, l: 0, a: 1 };
};

export const ColorFormat = {
	hsl(params: ColorFormatHslParams): ColorFormatHslResult {
		const normalizedHsl = normalizeHsl(params);

		return {
			isValid: () => isValidHsl(normalizedHsl),
			color: () => {
				return hslToColor(roundHsl(normalizedHsl));
			},
			rgb: ({ round }) => {
				const rgb = hslToRgb(normalizedHsl);

				return round ? roundRgb(rgb) : rgb;
			},
			hex: () => hslToHex(normalizedHsl),
		};
	},

	rgb(params: ColorFormatRgbParams): ColorFormatRgbResult {
		const normalizedRgb = normalizeRgb(params);

		return {
			isValid: () => isValidRgb(normalizedRgb),
			hsl: ({ round }) => {
				const hsl = rgbToHsl(normalizedRgb);

				return round ? roundHsl(hsl) : hsl;
			},
		};
	},

	hex(params: ColorFormatHexParams): ColorFormatHexResult {
		return {
			isValid: () => isValidHex(params),
			hsl: ({ round }) => {
				const hsl = hexToHsl(params);

				return round ? roundHsl(hsl) : hsl;
			},
		};
	},

	normalizeHsl(hsl: HslFormat) {
		return normalizeHsl(hsl);
	},

	normalizeRgb(rgb: RgbFormat) {
		return normalizeRgb(rgb);
	},

	roundHsl(hsl: HslFormat) {
		return roundHsl(hsl);
	},

	roundRgb(rgb: RgbFormat) {
		return roundRgb(rgb);
	},

	fromColor(params: ColorFormatFromColorParams) {
		return { hslFormat: () => getHSLFormatFromColor(params) };
	},
};
