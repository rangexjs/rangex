import { createStructuredStyleValue } from "@rangex/core";
import { assertNever } from "#utilities";
import type {
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
	ResolveLightDarkColorParams,
	ResolveLightDarkColorResult,
	ResolveStructuredColorParams,
	ResolveStructuredColorResult,
} from "./CreateStructuredStyle-types";

/*
 * A color's CSS value
 */
const resolveStructuredColor = ({
	color,
}: ResolveStructuredColorParams): ResolveStructuredColorResult => {
	if (color.type === "solid") {
		return color.value;
	}

	return assertNever(color.type);
};

/*
 * A light-dark() of the color's light and dark values
 */
const resolveLightDarkColor = ({
	lightDarkColor,
}: ResolveLightDarkColorParams): ResolveLightDarkColorResult => {
	const lightValue = resolveStructuredColor({ color: lightDarkColor.light });
	const darkValue = resolveStructuredColor({ color: lightDarkColor.dark });

	return `light-dark(${lightValue},${darkValue})`;
};

export const createBackgroundColorStructuredStyle = ({
	backgroundColor,
}: CreateBackgroundColorStructuredStyleParams): CreateBackgroundColorStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "background-color",
		values: {
			backgroundColor: {
				light: backgroundColor.light,
				dark: backgroundColor.dark,
			},
		},
		resolve: ({ backgroundColor }) =>
			resolveLightDarkColor({ lightDarkColor: backgroundColor }),
	});
};

export const createColorStructuredStyle = ({
	color,
}: CreateColorStructuredStyleParams): CreateColorStructuredStyleResult => {
	return createStructuredStyleValue({
		type: "color",
		values: { color: { light: color.light, dark: color.dark } },
		resolve: ({ color }) => resolveLightDarkColor({ lightDarkColor: color }),
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
