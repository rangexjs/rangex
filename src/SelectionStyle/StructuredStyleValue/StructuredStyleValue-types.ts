import type {
	FontFamilyValue,
	FontSizeValue,
	IndentationValue,
	LetterSpacingValue,
	LineHeightValue,
	LineSpacingValue,
	StructuredColor,
	TextAlignValue,
} from "@rangex/rich-text-editor-ui";
import type { StructuredStyleValue } from "rich-text-area";

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
		light: StructuredColor;
		dark: StructuredColor;
	};
	declarationValue: string;
}>;

export type ColorStructuredStyleValue = GetStructuredStyleValue<{
	type: "color";
	values: {
		light: StructuredColor;
		dark: StructuredColor;
	};
	declarationValue: string;
}>;

export type FontFamilyStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-family";
	values: {
		fontFamily: FontFamilyValue;
	};
	declarationValue: string;
}>;

export type FontSizeStructuredStyleValue = GetStructuredStyleValue<{
	type: "font-size";
	values: {
		fontSize: FontSizeValue;
	};
	declarationValue: string;
}>;

export type LetterSpacingStructuredStyleValue = GetStructuredStyleValue<{
	type: "letter-spacing";
	values: {
		letterSpacing: LetterSpacingValue;
	};
	declarationValue: string;
}>;

export type LineHeightStructuredStyleValue = GetStructuredStyleValue<{
	type: "line-height";
	values: {
		lineHeight: LineHeightValue;
	};
	declarationValue: string;
}>;

export type PaddingBlockStructuredStyleValue = GetStructuredStyleValue<{
	type: "padding-block";
	values: {
		paddingBlock: LineSpacingValue;
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
		textAlign: TextAlignValue;
	};
	declarationValue: string;
}>;

export type TextIndentStructuredStyleValue = GetStructuredStyleValue<{
	type: "text-indent";
	values: {
		textIndent: IndentationValue;
	};
	declarationValue: string;
}>;
