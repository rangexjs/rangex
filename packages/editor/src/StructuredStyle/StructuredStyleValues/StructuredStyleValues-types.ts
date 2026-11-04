import type { StructuredStyleValue } from "@rangex/core";

type GetStructuredStyleValue<T extends StructuredStyleValue> = T;

export type SolidColor = {
	type: "solid";
	value: string;
};

export type StructuredColor = SolidColor;

export type LightDarkColor = {
	light: StructuredColor;
	dark: StructuredColor;
};

export type BackgroundColorValue = LightDarkColor;

export type ColorValue = LightDarkColor;

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
	values: { backgroundColor: BackgroundColorValue };
	declarationValue: string;
}>;

export type ColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "color";
	values: { color: ColorValue };
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
