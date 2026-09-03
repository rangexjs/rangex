import type {
	FontFamilyOption,
	FormattingActionState,
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingFontFamilyState,
	FormattingFontFamilyValue,
	FormattingFontSizeState,
	FormattingFontSizeValue,
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineLocalNameState,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUnderlineState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveFormattingPort {
	backgroundColor: Accessor<FormattingBackgroundColorState>;
	bold: Accessor<FormattingBoldState>;
	code: Accessor<FormattingCodeState>;
	color: Accessor<FormattingColorState>;
	fontFamily: Accessor<FormattingFontFamilyState>;
	fontSize: Accessor<FormattingFontSizeState>;
	indentation: Accessor<FormattingIndentationState>;
	italic: Accessor<FormattingItalicState>;
	letterSpacing: Accessor<FormattingLetterSpacingState>;
	lineHeight: Accessor<FormattingLineHeightState>;
	lineLocalName: Accessor<FormattingLineLocalNameState>;
	lineSpacing: Accessor<FormattingLineSpacingState>;
	subscript: Accessor<FormattingSubscriptState>;
	superscript: Accessor<FormattingSuperscriptState>;
	strikethrough: Accessor<FormattingStrikethroughState>;
	textAlign: Accessor<FormattingTextAlignState>;
	underline: Accessor<FormattingUnderlineState>;

	readonly defaultFontFamily: FormattingFontFamilyValue;
	readonly defaultFontSize: FormattingFontSizeValue;
	readonly defaultIndentation: FormattingIndentationValue;
	readonly defaultLineHeight: FormattingLineHeightValue;
	readonly defaultLineSpacing: FormattingLineSpacingValue;
	readonly defaultTextAlign: FormattingTextAlignValue;
	readonly fontFamilyOptions: FontFamilyOption[];

	changeFormat(params: FormattingActionState): void;
}

export interface ReactiveFormattingResult {
	port: ReactiveFormattingPort;
	dispose: () => void;
}
