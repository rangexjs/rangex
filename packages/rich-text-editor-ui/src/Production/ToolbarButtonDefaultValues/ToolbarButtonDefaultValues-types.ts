import type {
	FontFamilyValue,
	FontSizeValue,
	IndentationValue,
	LineHeightValue,
	LineSpacingValue,
	TextAlignValue,
} from "../ToolbarButtonProps";

export interface DefaultStyleValues {
	fontFamily: FontFamilyValue;
	fontSize: FontSizeValue;
	indentation: IndentationValue;
	lineHeight: LineHeightValue;
	lineSpacing: LineSpacingValue;
	textAlign: TextAlignValue;
}

export interface UpdateStateParams extends Partial<DefaultStyleValues> {}
