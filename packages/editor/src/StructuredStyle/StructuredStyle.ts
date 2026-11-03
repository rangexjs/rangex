import {
	createStructuredStyleValue,
	type StructuredStyleValue,
} from "@rangex/core";
import { assertNever } from "#utilities";
import type {
	BackgroundColorStructuredStyleValue,
	ColorStructuredStyleValue,
	CreateBackgroundColorStructuredStyleParams,
	CreateBackgroundColorStructuredStyleResult,
	CreateColorStructuredStyleParams,
	CreateColorStructuredStyleResult,
	CreateFontFamilyStructuredStyleParams,
	CreateFontFamilyStructuredStyleResult,
	CreateFontSizeStructuredStyleParams,
	CreateFontSizeStructuredStyleResult,
	CreateLetterSpacingStructuredStyleParams,
	CreateLetterSpacingStructuredStyleResult,
	CreateLineHeightStructuredStyleParams,
	CreateLineHeightStructuredStyleResult,
	CreatePaddingBlockStructuredStyleParams,
	CreatePaddingBlockStructuredStyleResult,
	CreatePaddingInlineStructuredStyleParams,
	CreatePaddingInlineStructuredStyleResult,
	CreateTextAlignStructuredStyleParams,
	CreateTextAlignStructuredStyleResult,
	CreateTextIndentStructuredStyleParams,
	CreateTextIndentStructuredStyleResult,
	FontFamilyStructuredStyleValue,
	FontSizeStructuredStyleValue,
	LetterSpacingStructuredStyleValue,
	LineHeightStructuredStyleValue,
	PaddingBlockStructuredStyleValue,
	PaddingInlineStructuredStyleValue,
	ResolveStructuredColorParams,
	ResolveStructuredColorResult,
	ResolveThemeColorsParams,
	ResolveThemeColorsResult,
	StructuredStyleValueType,
	TextAlignStructuredStyleValue,
	TextIndentStructuredStyleValue,
} from "./StructuredStyle-types";

const isStructuredStyleOfType = (
	value: StructuredStyleValue,
	type: StructuredStyleValueType,
) => {
	if (value.type === type) {
		return true;
	}

	console.warn("Unknown structured style value was found.", value);
	return false;
};

/*
 * A color's CSS value: the color itself, or a linear-gradient() of its colors
 */
const resolveStructuredColor = ({
	color,
}: ResolveStructuredColorParams): ResolveStructuredColorResult => {
	if (color.type === "solid") {
		return color.value;
	}

	if (color.type === "linear-gradient") {
		const { deg, colors } = color;

		const colorValues = colors
			.map(({ value, offset }) => `${value} ${offset}%`)
			.join(",");

		return `linear-gradient(${deg}deg, ${colorValues})`;
	}

	return assertNever(color);
};

/*
 * A light-dark() of the theme's two colors
 */
const resolveThemeColors = ({
	themeColors,
}: ResolveThemeColorsParams): ResolveThemeColorsResult => {
	const lightValue = resolveStructuredColor({ color: themeColors.light });
	const darkValue = resolveStructuredColor({ color: themeColors.dark });

	return `light-dark(${lightValue},${darkValue})`;
};

export const createBackgroundColorStructuredStyle = ({
	backgroundColor,
}: CreateBackgroundColorStructuredStyleParams): CreateBackgroundColorStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "background-color",
		values: { light: backgroundColor.light, dark: backgroundColor.dark },
		resolve: (themeColors) => resolveThemeColors({ themeColors }),
	});
};

export const createColorStructuredStyle = ({
	color,
}: CreateColorStructuredStyleParams): CreateColorStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "color",
		values: { light: color.light, dark: color.dark },
		resolve: (themeColors) => resolveThemeColors({ themeColors }),
	});
};

export const createFontFamilyStructuredStyle = ({
	fontFamily,
}: CreateFontFamilyStructuredStyleParams): CreateFontFamilyStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "font-family",
		values: { fontFamily },
		resolve: ({ fontFamily }) => fontFamily,
	});
};

export const createFontSizeStructuredStyle = ({
	fontSize,
}: CreateFontSizeStructuredStyleParams): CreateFontSizeStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "font-size",
		values: { fontSize },
		resolve: ({ fontSize }) => {
			if (fontSize.type === "px") {
				return `${fontSize.value}px`;
			}

			return assertNever(fontSize.type);
		},
	});
};

export const createLetterSpacingStructuredStyle = ({
	letterSpacing,
}: CreateLetterSpacingStructuredStyleParams): CreateLetterSpacingStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "letter-spacing",
		values: { letterSpacing },
		resolve: ({ letterSpacing }) => {
			if (letterSpacing.type === "px") {
				return `${letterSpacing.value}px`;
			}

			return assertNever(letterSpacing.type);
		},
	});
};

export const createLineHeightStructuredStyle = ({
	lineHeight,
}: CreateLineHeightStructuredStyleParams): CreateLineHeightStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "line-height",
		values: { lineHeight },
		resolve: ({ lineHeight }) => {
			if (lineHeight.type === "number") {
				return `${lineHeight.value}`;
			}

			return assertNever(lineHeight.type);
		},
	});
};

export const createPaddingBlockStructuredStyle = ({
	paddingBlock,
}: CreatePaddingBlockStructuredStyleParams): CreatePaddingBlockStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "padding-block",
		values: { paddingBlock },
		resolve: ({ paddingBlock }) => {
			if (paddingBlock.type === "px") {
				return `${paddingBlock.value}px`;
			}

			return assertNever(paddingBlock.type);
		},
	});
};

export const createPaddingInlineStructuredStyle = ({
	paddingInline,
}: CreatePaddingInlineStructuredStyleParams): CreatePaddingInlineStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "padding-inline",
		values: { paddingInline },
		resolve: ({ paddingInline }) => {
			if (paddingInline.type === "px") {
				return `${paddingInline.value}px`;
			}

			return assertNever(paddingInline.type);
		},
	});
};

export const createTextAlignStructuredStyle = ({
	textAlign,
}: CreateTextAlignStructuredStyleParams): CreateTextAlignStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "text-align",
		values: { textAlign },
		resolve: ({ textAlign }) => textAlign,
	});
};

export const createTextIndentStructuredStyle = ({
	textIndent,
}: CreateTextIndentStructuredStyleParams): CreateTextIndentStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "text-indent",
		values: { textIndent },
		resolve: ({ textIndent }) => {
			if (textIndent.type === "px") {
				return `${textIndent.value}px`;
			}

			return assertNever(textIndent.type);
		},
	});
};

export const isValidBackgroundColorStructuredStyle = (
	value: StructuredStyleValue,
): value is BackgroundColorStructuredStyleValue => {
	return isStructuredStyleOfType(value, "background-color");
};

export const isValidColorStructuredStyle = (
	value: StructuredStyleValue,
): value is ColorStructuredStyleValue => {
	return isStructuredStyleOfType(value, "color");
};

export const isValidFontFamilyStructuredStyle = (
	value: StructuredStyleValue,
): value is FontFamilyStructuredStyleValue => {
	return isStructuredStyleOfType(value, "font-family");
};

export const isValidFontSizeStructuredStyle = (
	value: StructuredStyleValue,
): value is FontSizeStructuredStyleValue => {
	return isStructuredStyleOfType(value, "font-size");
};

export const isValidLetterSpacingStructuredStyle = (
	value: StructuredStyleValue,
): value is LetterSpacingStructuredStyleValue => {
	return isStructuredStyleOfType(value, "letter-spacing");
};

export const isValidLineHeightStructuredStyle = (
	value: StructuredStyleValue,
): value is LineHeightStructuredStyleValue => {
	return isStructuredStyleOfType(value, "line-height");
};

export const isValidPaddingBlockStructuredStyle = (
	value: StructuredStyleValue,
): value is PaddingBlockStructuredStyleValue => {
	return isStructuredStyleOfType(value, "padding-block");
};

export const isValidPaddingInlineStructuredStyle = (
	value: StructuredStyleValue,
): value is PaddingInlineStructuredStyleValue => {
	return isStructuredStyleOfType(value, "padding-inline");
};

export const isValidTextAlignStructuredStyle = (
	value: StructuredStyleValue,
): value is TextAlignStructuredStyleValue => {
	return isStructuredStyleOfType(value, "text-align");
};

export const isValidTextIndentStructuredStyle = (
	value: StructuredStyleValue,
): value is TextIndentStructuredStyleValue => {
	return isStructuredStyleOfType(value, "text-indent");
};
