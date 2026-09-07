import type {
	FontFamilyOption,
	FormattingBackgroundColorState,
	FormattingBackgroundColorValue,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingColorValue,
	FormattingFontFamilyState,
	FormattingFontFamilyValue,
	FormattingFontSizeState,
	FormattingFontSizeValue,
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLetterSpacingValue,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineLocalNameState,
	FormattingLineLocalNameValue,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingPublicPort,
	FormattingRemoveLineState,
	FormattingRemoveTextState,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUnderlineState,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveFormattingPort {
	readonly raw: FormattingPublicPort;

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
	removeLine: Accessor<FormattingRemoveLineState>;
	removeText: Accessor<FormattingRemoveTextState>;

	readonly defaultFontFamily: FormattingFontFamilyValue;
	readonly defaultFontSize: FormattingFontSizeValue;
	readonly defaultIndentation: FormattingIndentationValue;
	readonly defaultLineHeight: FormattingLineHeightValue;
	readonly defaultLineSpacing: FormattingLineSpacingValue;
	readonly defaultTextAlign: FormattingTextAlignValue;
	readonly fontFamilyOptions: FontFamilyOption[];

	setBackgroundColor(
		backgroundColor: FormattingBackgroundColorValue | null,
	): void;
	toggleBold(): void;
	toggleCode(): void;
	setColor(color: FormattingColorValue | null): void;
	setFontFamily(fontFamily: FormattingFontFamilyValue | null): void;
	setFontSize(fontSize: FormattingFontSizeValue | null): void;
	setIndentation(indentation: FormattingIndentationValue): void;
	toggleItalic(): void;
	setLetterSpacing(letterSpacing: FormattingLetterSpacingValue | null): void;
	setLineHeight(lineHeight: FormattingLineHeightValue): void;
	setLineLocalName(lineLocalName: FormattingLineLocalNameValue): void;
	setLineSpacing(lineSpacing: FormattingLineSpacingValue): void;
	toggleSubscript(): void;
	toggleSuperscript(): void;
	toggleStrikethrough(): void;
	setTextAlign(textAlign: FormattingTextAlignValue): void;
	toggleUnderline(): void;
	removeLineFormat(): void;
	removeTextFormat(): void;
}

export interface ReactiveFormattingResult {
	port: ReactiveFormattingPort;
	dispose: () => void;
}
