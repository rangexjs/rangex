import type { toolbarButtonsName } from "../../Constants";
import type {
	BackgroundColorToolbarButtonState,
	BoldToolbarButtonState,
	CodeToolbarButtonState,
	ColorToolbarButtonState,
	FontFamilyToolbarButtonState,
	FontSizeToolbarButtonState,
	IndentationToolbarButtonState,
	ItalicToolbarButtonState,
	LetterSpacingToolbarButtonState,
	LineHeightToolbarButtonState,
	LineLocalNameToolbarButtonState,
	LineSpacingToolbarButtonState,
	StrikethroughToolbarButtonState,
	SubscriptToolbarButtonState,
	SuperscriptToolbarButtonState,
	TextAlignToolbarButtonState,
	UnderlineToolbarButtonState,
} from "../../ToolbarButtonProps";

// BackgroundColor
export interface UpdateBackgroundColorStateParams
	extends BackgroundColorToolbarButtonState {}

export type UpdateBackgroundColorStateFn = (
	params: UpdateBackgroundColorStateParams,
) => void;

// Bold
export interface UpdateBoldStateParams extends BoldToolbarButtonState {}

export type UpdateBoldStateFn = (params: UpdateBoldStateParams) => void;

// Color
export interface UpdateColorStateParams extends ColorToolbarButtonState {}

export type UpdateColorStateFn = (params: UpdateColorStateParams) => void;

// Code
export interface UpdateCodeStateParams extends CodeToolbarButtonState {}

export type UpdateCodeStateFn = (params: UpdateCodeStateParams) => void;

// FontFamily
export interface UpdateFontFamilyStateParams
	extends FontFamilyToolbarButtonState {}

export type UpdateFontFamilyStateFn = (
	params: UpdateFontFamilyStateParams,
) => void;

// FontSize
export interface UpdateFontSizeStateParams extends FontSizeToolbarButtonState {}

export type UpdateFontSizeStateFn = (params: UpdateFontSizeStateParams) => void;

// Indentation
export interface UpdateIndentationStateParams
	extends IndentationToolbarButtonState {}

export type UpdateIndentationStateFn = (
	params: UpdateIndentationStateParams,
) => void;

// Italic
export interface UpdateItalicStateParams extends ItalicToolbarButtonState {}

export type UpdateItalicStateFn = (params: UpdateItalicStateParams) => void;

// LetterSpacing
export interface UpdateLetterSpacingStateParams
	extends LetterSpacingToolbarButtonState {}

export type UpdateLetterSpacingStateFn = (
	params: UpdateLetterSpacingStateParams,
) => void;

// LineHeight
export interface UpdateLineHeightStateParams
	extends LineHeightToolbarButtonState {}

export type UpdateLineHeightStateFn = (
	params: UpdateLineHeightStateParams,
) => void;

// LineLocalName
export interface UpdateLineLocalNameStateParams
	extends LineLocalNameToolbarButtonState {}

export type UpdateLineLocalNameStateFn = (
	params: UpdateLineLocalNameStateParams,
) => void;

// LineSpacing
export interface UpdateLineSpacingStateParams
	extends LineSpacingToolbarButtonState {}

export type UpdateLineSpacingStateFn = (
	params: UpdateLineSpacingStateParams,
) => void;

// Subscript
export interface UpdateSubscriptStateParams
	extends SubscriptToolbarButtonState {}

export type UpdateSubscriptStateFn = (
	params: UpdateSubscriptStateParams,
) => void;

// Superscript
export interface UpdateSuperscriptStateParams
	extends SuperscriptToolbarButtonState {}

export type UpdateSuperscriptStateFn = (
	params: UpdateSuperscriptStateParams,
) => void;

// Strikethrough
export interface UpdateStrikethroughStateParams
	extends StrikethroughToolbarButtonState {}

export type UpdateStrikethroughStateFn = (
	params: UpdateStrikethroughStateParams,
) => void;

// TextAlign
export interface UpdateTextAlignStateParams
	extends TextAlignToolbarButtonState {}

export type UpdateTextAlignStateFn = (
	params: UpdateTextAlignStateParams,
) => void;

// Underline
export interface UpdateUnderlineStateParams
	extends UnderlineToolbarButtonState {}

export type UpdateUnderlineStateFn = (
	params: UpdateUnderlineStateParams,
) => void;

export interface FormatStylesButtonsState {
	backgroundColor: Partial<BackgroundColorToolbarButtonState>;
	bold: Partial<BoldToolbarButtonState>;
	code: Partial<CodeToolbarButtonState>;
	color: Partial<ColorToolbarButtonState>;
	fontFamily: Partial<FontFamilyToolbarButtonState>;
	fontSize: Partial<FontSizeToolbarButtonState>;
	indentation: Partial<IndentationToolbarButtonState>;
	italic: Partial<ItalicToolbarButtonState>;
	letterSpacing: Partial<LetterSpacingToolbarButtonState>;
	lineHeight: Partial<LineHeightToolbarButtonState>;
	lineLocalName: Partial<LineLocalNameToolbarButtonState>;
	lineSpacing: Partial<LineSpacingToolbarButtonState>;
	subscript: Partial<SubscriptToolbarButtonState>;
	superscript: Partial<SuperscriptToolbarButtonState>;
	strikethrough: Partial<StrikethroughToolbarButtonState>;
	textAlign: Partial<TextAlignToolbarButtonState>;
	underline: Partial<UnderlineToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.backgroundColor]: UpdateBackgroundColorStateFn;
	[toolbarButtonsName.bold]: UpdateBoldStateFn;
	[toolbarButtonsName.code]: UpdateCodeStateFn;
	[toolbarButtonsName.color]: UpdateColorStateFn;
	[toolbarButtonsName.fontFamily]: UpdateFontFamilyStateFn;
	[toolbarButtonsName.fontSize]: UpdateFontSizeStateFn;
	[toolbarButtonsName.indentation]: UpdateIndentationStateFn;
	[toolbarButtonsName.italic]: UpdateItalicStateFn;
	[toolbarButtonsName.letterSpacing]: UpdateLetterSpacingStateFn;
	[toolbarButtonsName.lineHeight]: UpdateLineHeightStateFn;
	[toolbarButtonsName.lineLocalName]: UpdateLineLocalNameStateFn;
	[toolbarButtonsName.lineSpacing]: UpdateLineSpacingStateFn;
	[toolbarButtonsName.subscript]: UpdateSubscriptStateFn;
	[toolbarButtonsName.superscript]: UpdateSuperscriptStateFn;
	[toolbarButtonsName.strikethrough]: UpdateStrikethroughStateFn;
	[toolbarButtonsName.textAlign]: UpdateTextAlignStateFn;
	[toolbarButtonsName.underline]: UpdateUnderlineStateFn;
	statechange: () => void;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateFormatStylesButtonsStateParams
	extends Partial<FormatStylesButtonsState> {}
