import type {
	BackgroundColorStructuredStyleValue,
	BackgroundColorValue,
	ColorStructuredStyleValue,
	ColorValue,
	FontFamilyStructuredStyleValue,
	FontFamilyValue,
	FontSizeStructuredStyleValue,
	FontSizeValue,
	LetterSpacingStructuredStyleValue,
	LetterSpacingValue,
	LightDarkColor,
	LineHeightStructuredStyleValue,
	LineHeightValue,
	PaddingBlockStructuredStyleValue,
	PaddingBlockValue,
	PaddingInlineStructuredStyleValue,
	PaddingInlineValue,
	StructuredColor,
	TextAlignStructuredStyleValue,
	TextAlignValue,
	TextIndentStructuredStyleValue,
	TextIndentValue,
} from "../StructuredStyleValues";

export interface ResolveStructuredColorParams {
	color: StructuredColor;
}

export type ResolveStructuredColorResult = string;

export interface ResolveLightDarkColorParams {
	lightDarkColor: LightDarkColor;
}

export type ResolveLightDarkColorResult = string;

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
