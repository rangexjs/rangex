import type {
	MergedFormatsStyles,
	TextFormatInlineTags,
	UpdateSelectionStylesParams,
} from "rich-text-area";
import type {
	FormattingActionState,
	FormattingStructuredColor,
	FormattingWhenMixed,
} from "#adapters/Formatting";
import type {
	BackgroundColorStructuredStyleValue,
	ColorStructuredStyleValue,
	FontFamilyStructuredStyleValue,
	FontSizeStructuredStyleValue,
	LetterSpacingStructuredStyleValue,
	LineHeightStructuredStyleValue,
	PaddingBlockStructuredStyleValue,
	TextAlignStructuredStyleValue,
	TextIndentStructuredStyleValue,
} from "../StructuredStyleValue";

export interface GetColorValueFromStructuredColorParams {
	color: FormattingStructuredColor;
}

export type GetColorValueFromStructuredColorResult = string;

export interface GetBackgroundColorStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetBackgroundColorStylesResult =
	| BackgroundColorStructuredStyleValue
	| null
	| undefined;

export interface GetColorStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetColorStylesResult = ColorStructuredStyleValue | null | undefined;

export interface GetFontFamilyStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetFontFamilyStylesResult =
	| FontFamilyStructuredStyleValue
	| null
	| undefined;

export interface GetFontSizeStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetFontSizeStylesResult =
	| FontSizeStructuredStyleValue
	| null
	| undefined;

export interface GetLetterSpacingStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetLetterSpacingStylesResult =
	| LetterSpacingStructuredStyleValue
	| null
	| undefined;

export interface GetLineHeightStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetLineHeightStylesResult =
	| LineHeightStructuredStyleValue
	| undefined;

export interface GetPaddingBlockStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetPaddingBlockStylesResult =
	| PaddingBlockStructuredStyleValue
	| undefined;

export interface GetTextAlignStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetTextAlignStylesResult =
	| TextAlignStructuredStyleValue
	| undefined;

export interface GetTextIndentStylesParams {
	formattingActionState: FormattingActionState;
}

export type GetTextIndentStylesResult =
	| TextIndentStructuredStyleValue
	| undefined;

export interface GetStylesParams {
	formattingActionState: FormattingActionState;
}

export interface GetStylesResult extends MergedFormatsStyles {}

export interface GetInlineTagsParams {
	formattingActionState: FormattingActionState;
	whenMixed: FormattingWhenMixed;
}

export interface GetInlineTagsResult extends TextFormatInlineTags {}

export interface GetSelectionStylesDataParams {
	formattingActionState: FormattingActionState;
	whenMixed: FormattingWhenMixed;
}

export interface GetSelectionStylesDataResult
	extends UpdateSelectionStylesParams {}
