import type { StructuredStyleValue } from "@rangex/core";

type GetStructuredStyleValue<T extends StructuredStyleValue> = T;

export type SolidColor = {
	type: "solid";
	value: string;
};

export type LinearGradientColor = {
	type: "linear-gradient";
	deg: number;
	colors: { value: string; offset: number }[];
};

export type StructuredColor = SolidColor | LinearGradientColor;

export type ThemeColors = {
	light: StructuredColor;
	dark: StructuredColor;
};

export type BackgroundColorValue = ThemeColors;

export type ColorValue = ThemeColors;

export type FontFamilyValue = string;

export type FontSizeValue = {
	type: "px";
	value: number;
};

export type LetterSpacingValue = {
	type: "px";
	value: number;
};

export type LineHeightValue = {
	type: "number";
	value: number;
};

export type PaddingBlockValue = {
	type: "px";
	value: number;
};

export type PaddingInlineValue = {
	type: "px";
	value: number;
};

export type TextAlignValue = "start" | "center" | "justify" | "end";

export type TextIndentValue = {
	type: "px";
	value: number;
};

export type BackgroundColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "background-color";
	values: BackgroundColorValue;
	declarationValue: string;
}>;

export type ColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "color";
	values: ColorValue;
	declarationValue: string;
}>;

export type FontFamilyStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-family";
	values: { fontFamily: FontFamilyValue };
	declarationValue: string;
}>;

export type FontSizeStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-size";
	values: { fontSize: FontSizeValue };
	declarationValue: string;
}>;

export type LetterSpacingStructuredStyleValue = GetStructuredStyleValue<{
	type: "letter-spacing";
	values: { letterSpacing: LetterSpacingValue };
	declarationValue: string;
}>;

export type LineHeightStructuredStyleValue = GetStructuredStyleValue<{
	type: "line-height";
	values: { lineHeight: LineHeightValue };
	declarationValue: string;
}>;

export type PaddingBlockStructuredStyleValue = GetStructuredStyleValue<{
	type: "padding-block";
	values: { paddingBlock: PaddingBlockValue };
	declarationValue: string;
}>;

export type PaddingInlineStructuredStyleValue = GetStructuredStyleValue<{
	type: "padding-inline";
	values: { paddingInline: PaddingInlineValue };
	declarationValue: string;
}>;

export type TextAlignStructuredStyleValue = GetStructuredStyleValue<{
	type: "text-align";
	values: { textAlign: TextAlignValue };
	declarationValue: string;
}>;

export type TextIndentStructuredStyleValue = GetStructuredStyleValue<{
	type: "text-indent";
	values: { textIndent: TextIndentValue };
	declarationValue: string;
}>;

export type StructuredStyleValueType =
	| BackgroundColorStructuredStyleValue["type"]
	| ColorStructuredStyleValue["type"]
	| FontFamilyStructuredStyleValue["type"]
	| FontSizeStructuredStyleValue["type"]
	| LetterSpacingStructuredStyleValue["type"]
	| LineHeightStructuredStyleValue["type"]
	| PaddingBlockStructuredStyleValue["type"]
	| PaddingInlineStructuredStyleValue["type"]
	| TextAlignStructuredStyleValue["type"]
	| TextIndentStructuredStyleValue["type"];

export interface ResolveStructuredColorParams {
	color: StructuredColor;
}

export type ResolveStructuredColorResult = string;

export interface ResolveThemeColorsParams {
	themeColors: ThemeColors;
}

export type ResolveThemeColorsResult = string;

export interface CreateBackgroundColorStructuredStyleParams {
	backgroundColor: BackgroundColorValue;
}

export type CreateBackgroundColorStructuredStyleResult =
	BackgroundColorStructuredStyleValue;

export interface CreateColorStructuredStyleParams {
	color: ColorValue;
}

export type CreateColorStructuredStyleResult = ColorStructuredStyleValue;

export interface CreateFontFamilyStructuredStyleParams {
	fontFamily: FontFamilyValue;
}

export type CreateFontFamilyStructuredStyleResult =
	FontFamilyStructuredStyleValue;

export interface CreateFontSizeStructuredStyleParams {
	fontSize: FontSizeValue;
}

export type CreateFontSizeStructuredStyleResult = FontSizeStructuredStyleValue;

export interface CreateLetterSpacingStructuredStyleParams {
	letterSpacing: LetterSpacingValue;
}

export type CreateLetterSpacingStructuredStyleResult =
	LetterSpacingStructuredStyleValue;

export interface CreateLineHeightStructuredStyleParams {
	lineHeight: LineHeightValue;
}

export type CreateLineHeightStructuredStyleResult =
	LineHeightStructuredStyleValue;

export interface CreatePaddingBlockStructuredStyleParams {
	paddingBlock: PaddingBlockValue;
}

export type CreatePaddingBlockStructuredStyleResult =
	PaddingBlockStructuredStyleValue;

export interface CreatePaddingInlineStructuredStyleParams {
	paddingInline: PaddingInlineValue;
}

export type CreatePaddingInlineStructuredStyleResult =
	PaddingInlineStructuredStyleValue;

export interface CreateTextAlignStructuredStyleParams {
	textAlign: TextAlignValue;
}

export type CreateTextAlignStructuredStyleResult =
	TextAlignStructuredStyleValue;

export interface CreateTextIndentStructuredStyleParams {
	textIndent: TextIndentValue;
}

export type CreateTextIndentStructuredStyleResult =
	TextIndentStructuredStyleValue;
