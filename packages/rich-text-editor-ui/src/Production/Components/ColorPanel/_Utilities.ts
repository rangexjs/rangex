import type { StructuredColor } from "../../Color";
import { ColorFormat, type HslFormat } from "../../Color";
import { assertNever } from "../../ErrorHandling";
import type { ColorValues } from "../../ToolbarButtonProps";
import type { ColorMode } from "./ColorPanel";

const getHslFromColorType = (color: StructuredColor): HslFormat => {
	if (color.type === "solid") {
		const { value } = color;

		const hsl = ColorFormat.fromColor({ color: value }).hslFormat();

		return hsl;
	}

	if (color.type === "linear-gradient") {
		throw new Error("LinearGradient type hasn't implemented yet.");
	}

	return assertNever(color);
};

interface GetHslThemeColorsParams {
	colors: ColorValues;
}

interface GetHslThemeColorsResult {
	lightColors: HslFormat[];
	darkColors: HslFormat[];
}

export const getHslThemeColors = ({
	colors,
}: GetHslThemeColorsParams): GetHslThemeColorsResult => {
	const lightColors: HslFormat[] = [];
	const darkColors: HslFormat[] = [];

	for (const { light, dark } of colors) {
		const lightColor = getHslFromColorType(light);
		const darkColor = getHslFromColorType(dark);

		lightColors.push(lightColor);
		darkColors.push(darkColor);
	}

	return { lightColors, darkColors };
};

export const getDeduplicatedColors = (colors: HslFormat[]): HslFormat[] => {
	const deduplicatedColors: HslFormat[] = [];

	for (const color of colors) {
		const matchedColor = deduplicatedColors.find(({ h, s, l, a }) => {
			return color.h === h && color.s === s && color.l === l && color.a === a;
		});

		if (matchedColor) {
			continue;
		}

		deduplicatedColors.push(color);
	}

	return deduplicatedColors;
};

export interface GetColorModeParams {
	lightColors: HslFormat[];
	darkColors: HslFormat[];
}

export type GetColorModeResult = ColorMode;

/**
 * If the colors are same (or empty), it returns "common",
 * otherwise it returns "light".
 */
export const getColorMode = ({
	lightColors,
	darkColors,
}: GetColorModeParams): GetColorModeResult => {
	const deduplicatedLightColors = getDeduplicatedColors(lightColors);
	const deduplicatedDarkColors = getDeduplicatedColors(darkColors);

	if (
		(deduplicatedLightColors.length === 0 &&
			deduplicatedDarkColors.length === 0) ||
		deduplicatedLightColors.length !== deduplicatedDarkColors.length
	) {
		return "common";
	}

	for (const color of deduplicatedLightColors) {
		const matchedColor = deduplicatedDarkColors.find(({ h, s, l, a }) => {
			return color.h === h && color.s === s && color.l === l && color.a === a;
		});

		if (matchedColor) {
			continue;
		}

		return "light";
	}

	return "common";
};

interface GetGridPaletteColorsParams {
	paletteRows: number;
	paletteCols: number;
}

export const getGridPaletteColors = ({
	paletteRows,
	paletteCols,
}: GetGridPaletteColorsParams) => {
	const gridFilledColors = Array.from(
		{ length: paletteRows - 3 },
		(_, rowIndex) =>
			Array.from({ length: paletteCols }, (_, colIndex) => {
				const h = (360 / paletteCols) * colIndex;

				const s = (100 / paletteRows) * (paletteRows - rowIndex);

				const l = (100 / paletteRows) * (paletteRows - (rowIndex + 1));

				return { h, s, l, a: 1 };
			}),
	);

	const grayColors: HslFormat[] = [
		...Array.from({ length: paletteCols - 1 }, (_, index) => {
			const l = 100 - index * (100 / paletteCols);

			return { h: 0, s: 0, l: l, a: 1 };
		}),
		{ h: 0, s: 0, l: 0, a: 1 },
	];

	const gridPaletteColors: HslFormat[] = [
		grayColors,
		...gridFilledColors,
	].flat();

	return gridPaletteColors;
};
