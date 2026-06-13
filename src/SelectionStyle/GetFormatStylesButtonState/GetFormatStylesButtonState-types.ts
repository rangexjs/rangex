import type {
	BackgroundColorToolbarButtonState,
	ColorToolbarButtonState,
	CommonToggleButtonProps,
	FontFamilyToolbarButtonState,
	FontSizeToolbarButtonState,
	FormatStylesButtonsState,
	IndentationToolbarButtonState,
	LetterSpacingToolbarButtonState,
	LineHeightToolbarButtonState,
	LineLocalNameToolbarButtonState,
	LineSpacingToolbarButtonState,
	TextAlignToolbarButtonState,
} from "@rangex/rich-text-editor-ui";
import type {
	RangeFormatContentLineLocalNames,
	RangeFormatContentLineStructuredStyle,
	RangeFormatGlyphFormatterInlineTags,
	RangeFormatGlyphFormatterStructuredStyle,
	SelectionFormatStyles,
	TextFormatInlineTags,
	TextFormatStyles,
} from "rich-text-area";

export interface GetLineLocalNameParams {
	contentLineLocalNames: RangeFormatContentLineLocalNames;
}

export interface GetLineLocalNameResult
	extends LineLocalNameToolbarButtonState {}

export interface GetToggleButtonStateParams {
	inlineTagKey: keyof RangeFormatGlyphFormatterInlineTags;
	inlineTagStateKey: keyof TextFormatInlineTags;
}

export interface GetToggleButtonStateResult extends CommonToggleButtonProps {}

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
	extends LineHeightToolbarButtonState {}

export interface GetLineSpacingToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetLineSpacingToolbarButtonStateResult
	extends LineSpacingToolbarButtonState {}

export interface GetIndentationToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetIndentationToolbarButtonStateResult
	extends IndentationToolbarButtonState {}

export interface GetTextAlignToolbarButtonStateParams {
	contentLineStructuredStyle: RangeFormatContentLineStructuredStyle;
}

export interface GetTextAlignToolbarButtonStateResult
	extends TextAlignToolbarButtonState {}

export interface GetBackgroundColorToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetBackgroundColorToolbarButtonStateResult
	extends BackgroundColorToolbarButtonState {}

export interface GetColorToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetColorToolbarButtonStateResult
	extends ColorToolbarButtonState {}

export interface GetFontFamilyToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetFontFamilyToolbarButtonStateResult
	extends FontFamilyToolbarButtonState {}

export interface GetFontSizeToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetFontSizeToolbarButtonStateResult
	extends FontSizeToolbarButtonState {}

export interface GetLetterSpacingToolbarButtonStateParams {
	glyphFormatterStructuredStyle: RangeFormatGlyphFormatterStructuredStyle;
	textFormatStylesState: TextFormatStyles;
}

export interface GetLetterSpacingToolbarButtonStateResult
	extends LetterSpacingToolbarButtonState {}

export interface GetFormatStylesButtonStateParams {
	selectionFormatStyles: SelectionFormatStyles;
}

export interface GetformatStylesButtonStateResult
	extends FormatStylesButtonsState {}
