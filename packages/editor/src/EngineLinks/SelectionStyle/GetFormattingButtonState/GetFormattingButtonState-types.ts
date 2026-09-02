import type {
	RangeFormatContentLineLocalNames,
	RangeFormatContentLineStructuredStyle,
	RangeFormatGlyphFormatterInlineTags,
	RangeFormatGlyphFormatterStructuredStyle,
	SelectionFormatStyles,
	TextFormatInlineTags,
	TextFormatStyles,
} from "rich-text-area";
import type {
	FormattingBackgroundColorState,
	FormattingColorState,
	FormattingFontFamilyState,
	FormattingFontSizeState,
	FormattingIndentationState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineLocalNameState,
	FormattingLineSpacingState,
	FormattingState,
	FormattingTextAlignState,
	FormattingTogglePressed,
} from "#adapters/Formatting";

export interface GetLineLocalNameParams {
	contentLineLocalNames: RangeFormatContentLineLocalNames;
}

export interface GetLineLocalNameResult extends FormattingLineLocalNameState {}

export interface GetToggleButtonStateParams {
	inlineTagKey: keyof RangeFormatGlyphFormatterInlineTags;
	inlineTagStateKey: keyof TextFormatInlineTags;
}

export interface GetToggleButtonStateResult {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface InitializeToggleButtonStateGetterParams {
	glyphFormatterInlineTags: RangeFormatGlyphFormatterInlineTags;
	textFormatInlineTagsState: TextFormatInlineTags;
}

export type InitializeToggleButtonStateGetterResult = (
	params: GetToggleButtonStateParams,
) => GetToggleButtonStateResult;

export interface GetLineHeightToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetLineHeightToolbarButtonStateResult
	extends FormattingLineHeightState {}

export interface GetLineSpacingToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetLineSpacingToolbarButtonStateResult
	extends FormattingLineSpacingState {}

export interface GetIndentationToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetIndentationToolbarButtonStateResult
	extends FormattingIndentationState {}

export interface GetTextAlignToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetTextAlignToolbarButtonStateResult
	extends FormattingTextAlignState {}

export interface GetBackgroundColorToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetBackgroundColorToolbarButtonStateResult
	extends FormattingBackgroundColorState {}

export interface GetColorToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetColorToolbarButtonStateResult
	extends FormattingColorState {}

export interface GetFontFamilyToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetFontFamilyToolbarButtonStateResult
	extends FormattingFontFamilyState {}

export interface GetFontSizeToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetFontSizeToolbarButtonStateResult
	extends FormattingFontSizeState {}

export interface GetLetterSpacingToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetLetterSpacingToolbarButtonStateResult
	extends FormattingLetterSpacingState {}

export interface GetFormattingButtonStateParams {
	selectionFormatStyles: SelectionFormatStyles;
}

export interface GetFormattingButtonStateResult extends FormattingState {}
