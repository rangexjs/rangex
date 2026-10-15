import type {
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingFontFamilyState,
	FormattingFontSizeState,
	FormattingIndentationState,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineSpacingState,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingUnderlineState,
} from "../FormattingAdapter-types";

export interface IsRemoveLineDisabledParams {
	indentation: FormattingIndentationState;
	lineHeight: FormattingLineHeightState;
	lineSpacing: FormattingLineSpacingState;
	textAlign: FormattingTextAlignState;
}

export interface IsRemoveTextDisabledParams {
	backgroundColor: FormattingBackgroundColorState;
	bold: FormattingBoldState;
	code: FormattingCodeState;
	color: FormattingColorState;
	fontFamily: FormattingFontFamilyState;
	fontSize: FormattingFontSizeState;
	italic: FormattingItalicState;
	letterSpacing: FormattingLetterSpacingState;
	strikethrough: FormattingStrikethroughState;
	subscript: FormattingSubscriptState;
	superscript: FormattingSuperscriptState;
	underline: FormattingUnderlineState;
}
