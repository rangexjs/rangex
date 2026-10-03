import type { StructuredStyleValue } from "@rangex/core";
import type {
	FormattingFontFamilyValue,
	FormattingFontSizeValue,
	FormattingIndentationValue,
	FormattingLetterSpacingValue,
	FormattingLineHeightValue,
	FormattingLineSpacingValue,
	FormattingStructuredColor,
	FormattingTextAlignValue,
} from "#adapters/Formatting";

type GetStructuredStyleValue<T extends StructuredStyleValue> = T;

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

export type BackgroundColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "background-color";
	values: {
		light: FormattingStructuredColor;
		dark: FormattingStructuredColor;
	};
	declarationValue: string;
}>;

export type ColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "color";
	values: {
		light: FormattingStructuredColor;
		dark: FormattingStructuredColor;
	};
	declarationValue: string;
}>;

export type FontFamilyStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-family";
	values: {
		fontFamily: FormattingFontFamilyValue;
	};
	declarationValue: string;
}>;

export type FontSizeStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-size";
	values: {
		fontSize: FormattingFontSizeValue;
	};
	declarationValue: string;
}>;

export type LetterSpacingStructuredStyleValue = GetStructuredStyleValue<{
	type: "letter-spacing";
	values: {
		letterSpacing: FormattingLetterSpacingValue;
	};
	declarationValue: string;
}>;

export type LineHeightStructuredStyleValue = GetStructuredStyleValue<{
	type: "line-height";
	values: {
		lineHeight: FormattingLineHeightValue;
	};
	declarationValue: string;
}>;

export type PaddingBlockStructuredStyleValue = GetStructuredStyleValue<{
	type: "padding-block";
	values: {
		paddingBlock: FormattingLineSpacingValue;
	};
	declarationValue: string;
}>;

// RichTextEditorUI haven't implemented button for padding-inline so far
export type PaddingInlineStructuredStyleValue = GetStructuredStyleValue<{
	type: "padding-inline";
	values: {
		paddingInline: {
			type: "px";
			value: number;
		};
	};
	declarationValue: string;
}>;

export type TextAlignStructuredStyleValue = GetStructuredStyleValue<{
	type: "text-align";
	values: {
		textAlign: FormattingTextAlignValue;
	};
	declarationValue: string;
}>;

export type TextIndentStructuredStyleValue = GetStructuredStyleValue<{
	type: "text-indent";
	values: {
		textIndent: FormattingIndentationValue;
	};
	declarationValue: string;
}>;
