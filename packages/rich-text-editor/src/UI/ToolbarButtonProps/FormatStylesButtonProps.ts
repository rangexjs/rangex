import type { StructuredColor } from "../Color";

export interface StructuredThemeColors {
	light: StructuredColor;
	dark: StructuredColor;
}

export type ToggleButtonPressed = "true" | "false" | "mixed";

export interface CommonToggleButtonProps {
	disabled: boolean;
	pressed: ToggleButtonPressed;
}

// BackgroundColor
export type BackgroundColorValue = StructuredThemeColors;

export type BackgroundColorValues = Set<BackgroundColorValue>;

export interface BackgroundColorToolbarButtonState {
	disabled: boolean;
	values: BackgroundColorValues;
}

// Bold
export interface BoldToolbarButtonState extends CommonToggleButtonProps {}

// Code
export interface CodeToolbarButtonState extends CommonToggleButtonProps {}

// Color
export type ColorValue = StructuredThemeColors;

export type ColorValues = Set<ColorValue>;

export interface ColorToolbarButtonState {
	disabled: boolean;
	values: ColorValues;
}

export type FontFamilyValue = string;

// FontFamily
export type FontFamilyValues = Set<FontFamilyValue>;

export interface FontFamilyToolbarButtonState {
	disabled: boolean;
	values: FontFamilyValues;
}

// FontSize
export interface StructuredFontSizePx {
	type: "px";
	value: number;
}

export type FontSizeValue = StructuredFontSizePx;

export type FontSizeValues = Set<FontSizeValue>;

export interface FontSizeToolbarButtonState {
	disabled: boolean;
	values: FontSizeValues;
}

// Indentation
export interface StructuredIndentationPx {
	type: "px";
	value: number;
}

export type IndentationValue = StructuredIndentationPx;

export type IndentationValues = Set<IndentationValue>;

export interface IndentationToolbarButtonState {
	disabled: boolean;
	values: IndentationValues;
}

// Italic
export interface ItalicToolbarButtonState extends CommonToggleButtonProps {}

// LetterSpacing
interface StructuredLetterSpacingPx {
	type: "px";
	value: number;
}

export type LetterSpacingValue = StructuredLetterSpacingPx;

export type LetterSpacingValues = Set<LetterSpacingValue>;

export interface LetterSpacingToolbarButtonState {
	disabled: boolean;
	values: LetterSpacingValues;
}

// LineHeight
export interface StructuredLineHeightNumber {
	type: "number";
	value: number;
}

export type LineHeightValue = StructuredLineHeightNumber;

export type LineHeightValues = Set<LineHeightValue>;

export interface LineHeightToolbarButtonState {
	disabled: boolean;
	values: LineHeightValues;
}

// LineLocalName
export type LineLocalNameValue = "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type LineLocalNameValues = Set<LineLocalNameValue>;

export interface LineLocalNameToolbarButtonState {
	disabled: boolean;
	values: LineLocalNameValues;
}

// LineSpacing
export interface StructuredLineSpacingPx {
	type: "px";
	value: number;
}

export type LineSpacingValue = StructuredLineSpacingPx;

export type LineSpacingValues = Set<LineSpacingValue>;

export interface LineSpacingToolbarButtonState {
	disabled: boolean;
	values: LineSpacingValues;
}

// Subscript
export interface SubscriptToolbarButtonState extends CommonToggleButtonProps {}

// Superscript
export interface SuperscriptToolbarButtonState
	extends CommonToggleButtonProps {}

// Strikethrough
export interface StrikethroughToolbarButtonState
	extends CommonToggleButtonProps {}

// TextAlign
export type TextAlignValue = "start" | "center" | "justify" | "end";

export type TextAlignValues = Set<TextAlignValue>;

export interface TextAlignToolbarButtonState {
	disabled: boolean;
	values: TextAlignValues;
}

// Underline
export interface UnderlineToolbarButtonState extends CommonToggleButtonProps {}
