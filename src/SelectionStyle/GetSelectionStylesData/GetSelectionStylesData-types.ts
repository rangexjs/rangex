import type {
	FormatStylesActionState,
	StructuredColor,
} from "@rangex/rich-text-editor-ui";
import type {
	MergedFormatsStyles,
	TextFormatInlineTags,
	UpdateSelectionStylesParams,
} from "rich-text-area";
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
	color: StructuredColor;
}

export type GetColorValueFromStructuredColorResult = string;

export interface GetBackgroundColorStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetBackgroundColorStylesResult =
	| BackgroundColorStructuredStyleValue
	| null
	| undefined;

export interface GetColorStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetColorStylesResult = ColorStructuredStyleValue | null | undefined;

export interface GetFontFamilyStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetFontFamilyStylesResult =
	| FontFamilyStructuredStyleValue
	| null
	| undefined;

export interface GetFontSizeStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetFontSizeStylesResult =
	| FontSizeStructuredStyleValue
	| null
	| undefined;

export interface GetLetterSpacingStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetLetterSpacingStylesResult =
	| LetterSpacingStructuredStyleValue
	| null
	| undefined;

export interface GetLineHeightStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetLineHeightStylesResult =
	| LineHeightStructuredStyleValue
	| undefined;

export interface GetPaddingBlockStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetPaddingBlockStylesResult =
	| PaddingBlockStructuredStyleValue
	| undefined;

export interface GetTextAlignStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetTextAlignStylesResult =
	| TextAlignStructuredStyleValue
	| undefined;

export interface GetTextIndentStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export type GetTextIndentStylesResult =
	| TextIndentStructuredStyleValue
	| undefined;

export interface GetStylesParams {
	formatStylesActionState: FormatStylesActionState;
}

export interface GetStylesResult extends MergedFormatsStyles {}

type WhenMixed = "apply" | "remove";

export interface GetInlineTagsParams {
	formatStylesActionState: FormatStylesActionState;
	whenMixed: WhenMixed;
}

export interface GetInlineTagsResult extends TextFormatInlineTags {}

export interface GetSelectionStylesDataParams {
	formatStylesActionState: FormatStylesActionState;
	whenMixed: WhenMixed;
}

export interface GetSelectionStylesDataResult
	extends UpdateSelectionStylesParams {}
