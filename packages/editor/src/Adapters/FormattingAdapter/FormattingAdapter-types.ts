import type { CreateAdapterParams } from "../_Utilities";

export type FormattingWhenMixed = "apply" | "remove";

export interface FontFamilyOption {
	value: string;
	group: "sans-serif" | "serif" | "monospace";
}

export type FormattingTogglePressed = "true" | "false" | "mixed";

export interface FormattingToggleState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingToggleButton extends FormattingToggleState {
	checked: boolean;
}

export interface CreateToggleButtonParams extends FormattingToggleState {}

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

export interface FormattingBoldState extends FormattingToggleButton {}

export interface FormattingCodeState extends FormattingToggleButton {}

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

export interface FormattingItalicState extends FormattingToggleButton {}

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

export interface FormattingSubscriptState extends FormattingToggleButton {}

export interface FormattingSuperscriptState extends FormattingToggleButton {}

export interface FormattingStrikethroughState extends FormattingToggleButton {}

export interface FormattingTextAlignState {
	disabled: boolean;
	values: Set<FormattingTextAlignValue>;
}

export interface FormattingUnderlineState extends FormattingToggleButton {}

export interface FormattingRemoveLineState {
	disabled: boolean;
}

export interface FormattingRemoveTextState {
	disabled: boolean;
}

export interface FormattingState {
	backgroundColor?: FormattingBackgroundColorState;
	bold?: FormattingToggleState;
	code?: FormattingToggleState;
	color?: FormattingColorState;
	fontFamily?: FormattingFontFamilyState;
	fontSize?: FormattingFontSizeState;
	indentation?: FormattingIndentationState;
	italic?: FormattingToggleState;
	letterSpacing?: FormattingLetterSpacingState;
	lineHeight?: FormattingLineHeightState;
	lineLocalName?: FormattingLineLocalNameState;
	lineSpacing?: FormattingLineSpacingState;
	subscript?: FormattingToggleState;
	superscript?: FormattingToggleState;
	strikethrough?: FormattingToggleState;
	textAlign?: FormattingTextAlignState;
	underline?: FormattingToggleState;
}

export interface UpdateStateParams extends FormattingState {}

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

export type OnFormattingChangeCallbackFn = (
	params: FormattingActionState,
) => void;

export interface FormattingConfigPortProps {
	readonly whenMixed: FormattingWhenMixed;

	updateState(params: UpdateStateParams): void;
	onFormattingChange(callback: OnFormattingChangeCallbackFn): () => void;
}

export interface FormattingConfigPort extends FormattingConfigPortProps {}

export type OnBackgroundColorUpdateCallbackFn = (
	value: FormattingBackgroundColorState,
) => void;
export type OnBoldUpdateCallbackFn = (value: FormattingBoldState) => void;
export type OnCodeUpdateCallbackFn = (value: FormattingCodeState) => void;
export type OnColorUpdateCallbackFn = (value: FormattingColorState) => void;
export type OnFontFamilyUpdateCallbackFn = (
	value: FormattingFontFamilyState,
) => void;
export type OnFontSizeUpdateCallbackFn = (
	value: FormattingFontSizeState,
) => void;
export type OnIndentationUpdateCallbackFn = (
	value: FormattingIndentationState,
) => void;
export type OnItalicUpdateCallbackFn = (value: FormattingItalicState) => void;
export type OnLetterSpacingUpdateCallbackFn = (
	value: FormattingLetterSpacingState,
) => void;
export type OnLineHeightUpdateCallbackFn = (
	value: FormattingLineHeightState,
) => void;
export type OnLineLocalNameUpdateCallbackFn = (
	value: FormattingLineLocalNameState,
) => void;
export type OnLineSpacingUpdateCallbackFn = (
	value: FormattingLineSpacingState,
) => void;
export type OnSubscriptUpdateCallbackFn = (
	value: FormattingSubscriptState,
) => void;
export type OnSuperscriptUpdateCallbackFn = (
	value: FormattingSuperscriptState,
) => void;
export type OnStrikethroughUpdateCallbackFn = (
	value: FormattingStrikethroughState,
) => void;
export type OnTextAlignUpdateCallbackFn = (
	value: FormattingTextAlignState,
) => void;
export type OnUnderlineUpdateCallbackFn = (
	value: FormattingUnderlineState,
) => void;
export type OnRemoveLineUpdateCallbackFn = (
	value: FormattingRemoveLineState,
) => void;
export type OnRemoveTextUpdateCallbackFn = (
	value: FormattingRemoveTextState,
) => void;

export interface FormattingPublicPortProps {
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
	readonly removeLine: FormattingRemoveLineState;
	readonly removeText: FormattingRemoveTextState;
	// Configured once at construction, not pushed by the Editor.
	readonly defaultFontFamily: FormattingFontFamilyValue;
	readonly defaultFontSize: FormattingFontSizeValue;
	readonly defaultIndentation: FormattingIndentationValue;
	readonly defaultLineHeight: FormattingLineHeightValue;
	readonly defaultLineSpacing: FormattingLineSpacingValue;
	readonly defaultTextAlign: FormattingTextAlignValue;
	readonly fontFamilyOptions: FontFamilyOption[];

	onBackgroundColorUpdate(
		callback: OnBackgroundColorUpdateCallbackFn,
	): () => void;
	onBoldUpdate(callback: OnBoldUpdateCallbackFn): () => void;
	onCodeUpdate(callback: OnCodeUpdateCallbackFn): () => void;
	onColorUpdate(callback: OnColorUpdateCallbackFn): () => void;
	onFontFamilyUpdate(callback: OnFontFamilyUpdateCallbackFn): () => void;
	onFontSizeUpdate(callback: OnFontSizeUpdateCallbackFn): () => void;
	onIndentationUpdate(callback: OnIndentationUpdateCallbackFn): () => void;
	onItalicUpdate(callback: OnItalicUpdateCallbackFn): () => void;
	onLetterSpacingUpdate(callback: OnLetterSpacingUpdateCallbackFn): () => void;
	onLineHeightUpdate(callback: OnLineHeightUpdateCallbackFn): () => void;
	onLineLocalNameUpdate(callback: OnLineLocalNameUpdateCallbackFn): () => void;
	onLineSpacingUpdate(callback: OnLineSpacingUpdateCallbackFn): () => void;
	onSubscriptUpdate(callback: OnSubscriptUpdateCallbackFn): () => void;
	onSuperscriptUpdate(callback: OnSuperscriptUpdateCallbackFn): () => void;
	onStrikethroughUpdate(callback: OnStrikethroughUpdateCallbackFn): () => void;
	onTextAlignUpdate(callback: OnTextAlignUpdateCallbackFn): () => void;
	onUnderlineUpdate(callback: OnUnderlineUpdateCallbackFn): () => void;
	onRemoveLineUpdate(callback: OnRemoveLineUpdateCallbackFn): () => void;
	onRemoveTextUpdate(callback: OnRemoveTextUpdateCallbackFn): () => void;

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

export interface FormattingPublicPort extends FormattingPublicPortProps {}

export interface FormattingInternals {
	backgroundColor: FormattingBackgroundColorState;
	bold: FormattingBoldState;
	code: FormattingCodeState;
	color: FormattingColorState;
	fontFamily: FormattingFontFamilyState;
	fontSize: FormattingFontSizeState;
	indentation: FormattingIndentationState;
	italic: FormattingItalicState;
	letterSpacing: FormattingLetterSpacingState;
	lineHeight: FormattingLineHeightState;
	lineLocalName: FormattingLineLocalNameState;
	lineSpacing: FormattingLineSpacingState;
	subscript: FormattingSubscriptState;
	superscript: FormattingSuperscriptState;
	strikethrough: FormattingStrikethroughState;
	textAlign: FormattingTextAlignState;
	underline: FormattingUnderlineState;
	removeLine: FormattingRemoveLineState;
	removeText: FormattingRemoveTextState;
	defaultFontFamily: FormattingFontFamilyValue;
	defaultFontSize: FormattingFontSizeValue;
	defaultIndentation: FormattingIndentationValue;
	defaultLineHeight: FormattingLineHeightValue;
	defaultLineSpacing: FormattingLineSpacingValue;
	defaultTextAlign: FormattingTextAlignValue;
	fontFamilyOptions: FontFamilyOption[];
}

export interface FormattingAdapter {
	configPort: FormattingConfigPort;
	publicPort: FormattingPublicPort;
}

export interface FormattingSettings {
	whenMixed?: FormattingWhenMixed;
	defaultFontFamily?: FormattingFontFamilyValue;
	defaultFontSize?: FormattingFontSizeValue;
	defaultIndentation?: FormattingIndentationValue;
	defaultLineHeight?: FormattingLineHeightValue;
	defaultLineSpacing?: FormattingLineSpacingValue;
	defaultTextAlign?: FormattingTextAlignValue;
	fontFamilyOptions?: FontFamilyOption[];
}

export interface CreateFormattingAdapterParams
	extends CreateAdapterParams<FormattingSettings> {}

export interface CreateFormattingAdapterResult extends FormattingAdapter {}
