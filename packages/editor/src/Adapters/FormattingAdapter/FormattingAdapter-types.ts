import type { CreateAdapterConstructor } from "../_Utilities";

export interface FontFamilyOption {
	value: string;
	group: "sans-serif" | "serif" | "monospace";
}

export interface FormattingSettings {
	defaultFontFamily?: FormattingFontFamilyValue;
	defaultFontSize?: FormattingFontSizeValue;
	defaultIndentation?: FormattingIndentationValue;
	defaultLineHeight?: FormattingLineHeightValue;
	defaultLineSpacing?: FormattingLineSpacingValue;
	defaultTextAlign?: FormattingTextAlignValue;
	fontFamilyOptions?: FontFamilyOption[];
}

export type FormattingAdapterConstructorParams =
	CreateAdapterConstructor<FormattingSettings>;

export type FormattingTogglePressed = "true" | "false" | "mixed";

export interface FormattingSolidColor {
	type: "solid";
	value: string;
}

export interface FormattingLinearGradientColor {
	type: "linear-gradient";
	deg: number;
	colors: { value: string; offset: number }[];
}

export type FormattingStructuredColor =
	| FormattingSolidColor
	| FormattingLinearGradientColor;

export interface FormattingStructuredThemeColors {
	light: FormattingStructuredColor;
	dark: FormattingStructuredColor;
}

export type FormattingBackgroundColorValue = FormattingStructuredThemeColors;
export type FormattingColorValue = FormattingStructuredThemeColors;
export type FormattingFontFamilyValue = string;

export interface FormattingFontSizeValue {
	type: "px";
	value: number;
}

export interface FormattingIndentationValue {
	type: "px";
	value: number;
}

export interface FormattingLetterSpacingValue {
	type: "px";
	value: number;
}

export interface FormattingLineHeightValue {
	type: "number";
	value: number;
}

export type FormattingLineLocalNameValue = "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`;

export interface FormattingLineSpacingValue {
	type: "px";
	value: number;
}

export type FormattingTextAlignValue = "start" | "center" | "justify" | "end";

export interface FormattingBackgroundColorState {
	disabled: boolean;
	values: Set<FormattingBackgroundColorValue>;
}

export interface FormattingBoldState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingCodeState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingColorState {
	disabled: boolean;
	values: Set<FormattingColorValue>;
}

export interface FormattingFontFamilyState {
	disabled: boolean;
	values: Set<FormattingFontFamilyValue>;
}

export interface FormattingFontSizeState {
	disabled: boolean;
	values: Set<FormattingFontSizeValue>;
}

export interface FormattingIndentationState {
	disabled: boolean;
	values: Set<FormattingIndentationValue>;
}

export interface FormattingItalicState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingLetterSpacingState {
	disabled: boolean;
	values: Set<FormattingLetterSpacingValue>;
}

export interface FormattingLineHeightState {
	disabled: boolean;
	values: Set<FormattingLineHeightValue>;
}

export interface FormattingLineLocalNameState {
	disabled: boolean;
	values: Set<FormattingLineLocalNameValue>;
}

export interface FormattingLineSpacingState {
	disabled: boolean;
	values: Set<FormattingLineSpacingValue>;
}

export interface FormattingSubscriptState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingSuperscriptState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingStrikethroughState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingTextAlignState {
	disabled: boolean;
	values: Set<FormattingTextAlignValue>;
}

export interface FormattingUnderlineState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingState {
	backgroundColor?: FormattingBackgroundColorState;
	bold?: FormattingBoldState;
	code?: FormattingCodeState;
	color?: FormattingColorState;
	fontFamily?: FormattingFontFamilyState;
	fontSize?: FormattingFontSizeState;
	indentation?: FormattingIndentationState;
	italic?: FormattingItalicState;
	letterSpacing?: FormattingLetterSpacingState;
	lineHeight?: FormattingLineHeightState;
	lineLocalName?: FormattingLineLocalNameState;
	lineSpacing?: FormattingLineSpacingState;
	subscript?: FormattingSubscriptState;
	superscript?: FormattingSuperscriptState;
	strikethrough?: FormattingStrikethroughState;
	textAlign?: FormattingTextAlignState;
	underline?: FormattingUnderlineState;
}

export interface UpdateFormattingStateParams extends FormattingState {}

// Action state — UI → Editor, what `uiPort.emitFormattingChange` takes. Flat raw
// values: `null` clears the value, an absent key leaves it untouched.
export interface FormattingActionState {
	backgroundColor?: FormattingBackgroundColorValue | null;
	bold?: FormattingTogglePressed;
	code?: FormattingTogglePressed;
	color?: FormattingColorValue | null;
	fontFamily?: FormattingFontFamilyValue | null;
	fontSize?: FormattingFontSizeValue | null;
	indentation?: FormattingIndentationValue;
	italic?: FormattingTogglePressed;
	letterSpacing?: FormattingLetterSpacingValue | null;
	lineHeight?: FormattingLineHeightValue;
	lineLocalName?: FormattingLineLocalNameValue;
	lineSpacing?: FormattingLineSpacingValue;
	subscript?: FormattingTogglePressed;
	superscript?: FormattingTogglePressed;
	strikethrough?: FormattingTogglePressed;
	textAlign?: FormattingTextAlignValue;
	underline?: FormattingTogglePressed;
}

export type OnFormattingChangeFn = (params: FormattingActionState) => void;

export interface FormattingConfigPort {
	updateState(params: FormattingState): void;
	onFormattingChange(callback: OnFormattingChangeFn): () => void;
}

export type FormattingUpdateBackgroundColorFn = (
	value: FormattingBackgroundColorState,
) => void;
export type FormattingUpdateBoldFn = (value: FormattingBoldState) => void;
export type FormattingUpdateCodeFn = (value: FormattingCodeState) => void;
export type FormattingUpdateColorFn = (value: FormattingColorState) => void;
export type FormattingUpdateFontFamilyFn = (
	value: FormattingFontFamilyState,
) => void;
export type FormattingUpdateFontSizeFn = (
	value: FormattingFontSizeState,
) => void;
export type FormattingUpdateIndentationFn = (
	value: FormattingIndentationState,
) => void;
export type FormattingUpdateItalicFn = (value: FormattingItalicState) => void;
export type FormattingUpdateLetterSpacingFn = (
	value: FormattingLetterSpacingState,
) => void;
export type FormattingUpdateLineHeightFn = (
	value: FormattingLineHeightState,
) => void;
export type FormattingUpdateLineLocalNameFn = (
	value: FormattingLineLocalNameState,
) => void;
export type FormattingUpdateLineSpacingFn = (
	value: FormattingLineSpacingState,
) => void;
export type FormattingUpdateSubscriptFn = (
	value: FormattingSubscriptState,
) => void;
export type FormattingUpdateSuperscriptFn = (
	value: FormattingSuperscriptState,
) => void;
export type FormattingUpdateStrikethroughFn = (
	value: FormattingStrikethroughState,
) => void;
export type FormattingUpdateTextAlignFn = (
	value: FormattingTextAlignState,
) => void;
export type FormattingUpdateUnderlineFn = (
	value: FormattingUnderlineState,
) => void;
export type OnAnyFieldUpdateFn = () => void;

export interface FormattingPublicPort {
	readonly backgroundColor: FormattingBackgroundColorState;
	readonly bold: FormattingBoldState;
	readonly code: FormattingCodeState;
	readonly color: FormattingColorState;
	readonly fontFamily: FormattingFontFamilyState;
	readonly fontSize: FormattingFontSizeState;
	readonly indentation: FormattingIndentationState;
	readonly italic: FormattingItalicState;
	readonly letterSpacing: FormattingLetterSpacingState;
	readonly lineHeight: FormattingLineHeightState;
	readonly lineLocalName: FormattingLineLocalNameState;
	readonly lineSpacing: FormattingLineSpacingState;
	readonly subscript: FormattingSubscriptState;
	readonly superscript: FormattingSuperscriptState;
	readonly strikethrough: FormattingStrikethroughState;
	readonly textAlign: FormattingTextAlignState;
	readonly underline: FormattingUnderlineState;
	// Configured once at construction, not pushed by the Editor.
	readonly defaultFontFamily: FormattingFontFamilyValue;
	readonly defaultFontSize: FormattingFontSizeValue;
	readonly defaultIndentation: FormattingIndentationValue;
	readonly defaultLineHeight: FormattingLineHeightValue;
	readonly defaultLineSpacing: FormattingLineSpacingValue;
	readonly defaultTextAlign: FormattingTextAlignValue;
	readonly fontFamilyOptions: FontFamilyOption[];

	onBackgroundColorUpdate(
		callback: FormattingUpdateBackgroundColorFn,
	): () => void;
	onBoldUpdate(callback: FormattingUpdateBoldFn): () => void;
	onCodeUpdate(callback: FormattingUpdateCodeFn): () => void;
	onColorUpdate(callback: FormattingUpdateColorFn): () => void;
	onFontFamilyUpdate(callback: FormattingUpdateFontFamilyFn): () => void;
	onFontSizeUpdate(callback: FormattingUpdateFontSizeFn): () => void;
	onIndentationUpdate(callback: FormattingUpdateIndentationFn): () => void;
	onItalicUpdate(callback: FormattingUpdateItalicFn): () => void;
	onLetterSpacingUpdate(callback: FormattingUpdateLetterSpacingFn): () => void;
	onLineHeightUpdate(callback: FormattingUpdateLineHeightFn): () => void;
	onLineLocalNameUpdate(callback: FormattingUpdateLineLocalNameFn): () => void;
	onLineSpacingUpdate(callback: FormattingUpdateLineSpacingFn): () => void;
	onSubscriptUpdate(callback: FormattingUpdateSubscriptFn): () => void;
	onSuperscriptUpdate(callback: FormattingUpdateSuperscriptFn): () => void;
	onStrikethroughUpdate(callback: FormattingUpdateStrikethroughFn): () => void;
	onTextAlignUpdate(callback: FormattingUpdateTextAlignFn): () => void;
	onUnderlineUpdate(callback: FormattingUpdateUnderlineFn): () => void;
	onAnyFieldUpdate(callback: OnAnyFieldUpdateFn): () => void;
	changeFormat(params: FormattingActionState): void;
}
