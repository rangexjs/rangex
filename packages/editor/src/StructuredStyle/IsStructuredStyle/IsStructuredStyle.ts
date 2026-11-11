import type { StructuredStyleValue } from "@rangex/core";

import { type JSONPattern, matchJSON } from "#utilities";

import {
	createBackgroundColorStructuredStyle,
	createColorStructuredStyle,
	createFontFamilyStructuredStyle,
	createFontSizeStructuredStyle,
	createLetterSpacingStructuredStyle,
	createLineHeightStructuredStyle,
	createPaddingBlockStructuredStyle,
	createPaddingInlineStructuredStyle,
	createTextAlignStructuredStyle,
	createTextIndentStructuredStyle,
} from "../CreateStructuredStyle";
import type {
	BackgroundColorStructuredStyleValue,
	ColorStructuredStyleValue,
	FontFamilyStructuredStyleValue,
	FontSizeStructuredStyleValue,
	LetterSpacingStructuredStyleValue,
	LightDarkColor,
	LineHeightStructuredStyleValue,
	PaddingBlockStructuredStyleValue,
	PaddingInlineStructuredStyleValue,
	SolidColor,
	TextAlignStructuredStyleValue,
	TextAlignValue,
	TextIndentStructuredStyleValue,
} from "../StructuredStyleValues";
import type {
	IsStructuredStyleOfParams,
	IsStructuredStyleOfResult,
} from "./IsStructuredStyle-types";

const hexColorPattern = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

// Letters and digits of any script, spaces, "-" and "_": a font's name, without quotes, commas or any CSS syntax
const fontFamilyPattern = /^[\p{L}\p{N} _-]+$/u;

const maxFontFamilyLength = 128;

const textAligns: unknown[] = ["start", "center", "justify", "end"] satisfies TextAlignValue[];

/*
 * A color is valid if it's a hex color of 3, 4, 6 or 8 digits. Without the DOM, it's the one format that can be checked
 * exactly.
 */
const isHexColor = (value: unknown) => {
	return typeof value === "string" && hexColorPattern.test(value);
};

const isFontFamily = (value: unknown) => {
	return (
		typeof value === "string" &&
		value.length <= maxFontFamilyLength &&
		fontFamilyPattern.test(value)
	);
};

const isTextAlign = (value: unknown) => {
	return textAligns.includes(value);
};

/*
 * A predicate for a finite number from min to max
 */
const isNumberBetween = (min: number, max: number) => {
	return (value: unknown) =>
		typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
};

/*
 * A predicate for an integer from min to max
 */
const isIntegerBetween = (min: number, max: number) => {
	return (value: unknown) => Number.isInteger(value) && isNumberBetween(min, max)(value);
};

const solidColorPattern = {
	type: "solid",
	value: isHexColor,
} satisfies JSONPattern<SolidColor>;

const lightDarkColorPattern = {
	light: solidColorPattern,
	dark: solidColorPattern,
} satisfies JSONPattern<LightDarkColor>;

const backgroundColorValuesPattern = {
	backgroundColor: lightDarkColorPattern,
} satisfies JSONPattern<BackgroundColorStructuredStyleValue["values"]>;

const colorValuesPattern = {
	color: lightDarkColorPattern,
} satisfies JSONPattern<ColorStructuredStyleValue["values"]>;

const fontFamilyValuesPattern = {
	fontFamily: isFontFamily,
} satisfies JSONPattern<FontFamilyStructuredStyleValue["values"]>;

const fontSizeValuesPattern = {
	fontSize: { type: "px", value: isIntegerBetween(1, 400) },
} satisfies JSONPattern<FontSizeStructuredStyleValue["values"]>;

const letterSpacingValuesPattern = {
	letterSpacing: { type: "px", value: isNumberBetween(-50, 50) },
} satisfies JSONPattern<LetterSpacingStructuredStyleValue["values"]>;

const lineHeightValuesPattern = {
	lineHeight: { type: "number", value: isNumberBetween(0.1, 10) },
} satisfies JSONPattern<LineHeightStructuredStyleValue["values"]>;

const paddingBlockValuesPattern = {
	paddingBlock: { type: "px", value: isNumberBetween(0, 200) },
} satisfies JSONPattern<PaddingBlockStructuredStyleValue["values"]>;

const paddingInlineValuesPattern = {
	paddingInline: { type: "px", value: isNumberBetween(0, 200) },
} satisfies JSONPattern<PaddingInlineStructuredStyleValue["values"]>;

const textAlignValuesPattern = {
	textAlign: isTextAlign,
} satisfies JSONPattern<TextAlignStructuredStyleValue["values"]>;

const textIndentValuesPattern = {
	textIndent: { type: "px", value: isNumberBetween(0, 500) },
} satisfies JSONPattern<TextIndentStructuredStyleValue["values"]>;

/*
 * Whether a structured style is valid: its type, its values by the pattern (nothing else in them), and its
 * declarationValue the one its values resolve to, so the rendered CSS can't be anything else.
 */
const isStructuredStyleOf = <TStructuredStyle extends StructuredStyleValue>({
	structuredStyle,
	type,
	valuesPattern,
	createStructuredStyle,
}: IsStructuredStyleOfParams<TStructuredStyle>): IsStructuredStyleOfResult => {
	const { values, declarationValue } = structuredStyle;

	if (structuredStyle.type !== type) {
		return false;
	}

	const valuesMismatch = matchJSON<unknown>({
		value: values,
		pattern: valuesPattern,
	});

	if (valuesMismatch) {
		return false;
	}

	// Matched above
	const matchedValues = values as TStructuredStyle["values"];

	const resolvedStructuredStyle = createStructuredStyle(matchedValues);

	return declarationValue === resolvedStructuredStyle.declarationValue;
};

export const isBackgroundColorStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is BackgroundColorStructuredStyleValue => {
	return isStructuredStyleOf<BackgroundColorStructuredStyleValue>({
		structuredStyle,
		type: "background-color",
		valuesPattern: backgroundColorValuesPattern,
		createStructuredStyle: createBackgroundColorStructuredStyle,
	});
};

export const isColorStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is ColorStructuredStyleValue => {
	return isStructuredStyleOf<ColorStructuredStyleValue>({
		structuredStyle,
		type: "color",
		valuesPattern: colorValuesPattern,
		createStructuredStyle: createColorStructuredStyle,
	});
};

export const isFontFamilyStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is FontFamilyStructuredStyleValue => {
	return isStructuredStyleOf<FontFamilyStructuredStyleValue>({
		structuredStyle,
		type: "font-family",
		valuesPattern: fontFamilyValuesPattern,
		createStructuredStyle: createFontFamilyStructuredStyle,
	});
};

export const isFontSizeStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is FontSizeStructuredStyleValue => {
	return isStructuredStyleOf<FontSizeStructuredStyleValue>({
		structuredStyle,
		type: "font-size",
		valuesPattern: fontSizeValuesPattern,
		createStructuredStyle: createFontSizeStructuredStyle,
	});
};

export const isLetterSpacingStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is LetterSpacingStructuredStyleValue => {
	return isStructuredStyleOf<LetterSpacingStructuredStyleValue>({
		structuredStyle,
		type: "letter-spacing",
		valuesPattern: letterSpacingValuesPattern,
		createStructuredStyle: createLetterSpacingStructuredStyle,
	});
};

export const isLineHeightStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is LineHeightStructuredStyleValue => {
	return isStructuredStyleOf<LineHeightStructuredStyleValue>({
		structuredStyle,
		type: "line-height",
		valuesPattern: lineHeightValuesPattern,
		createStructuredStyle: createLineHeightStructuredStyle,
	});
};

export const isPaddingBlockStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is PaddingBlockStructuredStyleValue => {
	return isStructuredStyleOf<PaddingBlockStructuredStyleValue>({
		structuredStyle,
		type: "padding-block",
		valuesPattern: paddingBlockValuesPattern,
		createStructuredStyle: createPaddingBlockStructuredStyle,
	});
};

export const isPaddingInlineStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is PaddingInlineStructuredStyleValue => {
	return isStructuredStyleOf<PaddingInlineStructuredStyleValue>({
		structuredStyle,
		type: "padding-inline",
		valuesPattern: paddingInlineValuesPattern,
		createStructuredStyle: createPaddingInlineStructuredStyle,
	});
};

export const isTextAlignStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is TextAlignStructuredStyleValue => {
	return isStructuredStyleOf<TextAlignStructuredStyleValue>({
		structuredStyle,
		type: "text-align",
		valuesPattern: textAlignValuesPattern,
		createStructuredStyle: createTextAlignStructuredStyle,
	});
};

export const isTextIndentStructuredStyle = (
	structuredStyle: StructuredStyleValue,
): structuredStyle is TextIndentStructuredStyleValue => {
	return isStructuredStyleOf<TextIndentStructuredStyleValue>({
		structuredStyle,
		type: "text-indent",
		valuesPattern: textIndentValuesPattern,
		createStructuredStyle: createTextIndentStructuredStyle,
	});
};
