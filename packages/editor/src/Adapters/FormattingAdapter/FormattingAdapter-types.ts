import type {
	BackgroundColorValue,
	ColorValue,
	FontFamilyValue,
	FontSizeValue,
	LetterSpacingValue,
	LineHeightValue,
	PaddingBlockValue,
	TextAlignValue,
	TextIndentValue,
} from "#structured-style";

import type { CreateAdapterParams } from "../_Utilities";

export type FormattingWhenMixed = "apply" | "remove";

export type FormattingTogglePressed = "true" | "false" | "mixed";

export interface FormattingToggleState {
	disabled: boolean;
	pressed: FormattingTogglePressed;
}

export interface FormattingToggleButton extends FormattingToggleState {
	checked: boolean;
}

export interface CreateToggleButtonParams extends FormattingToggleState {}

export type FormattingLineLocalNameValue = "p" | `h${1 | 2 | 3 | 4 | 5 | 6}`;

export interface FormattingBackgroundColorState {
	disabled: boolean;
	values: Set<BackgroundColorValue>;
}

export interface FormattingBoldState extends FormattingToggleButton {}

export interface FormattingCodeState extends FormattingToggleButton {}

export interface FormattingColorState {
	disabled: boolean;
	values: Set<ColorValue>;
}

export interface FormattingFontFamilyState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<FontFamilyValue>;
}

export interface FormattingFontSizeState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<FontSizeValue>;
}

export interface FormattingIndentationState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<TextIndentValue>;
}

export interface FormattingItalicState extends FormattingToggleButton {}

export interface FormattingLetterSpacingState {
	disabled: boolean;
	values: Set<LetterSpacingValue>;
}

export interface FormattingLineHeightState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<LineHeightValue>;
}

export interface FormattingLineLocalNameState {
	disabled: boolean;
	values: Set<FormattingLineLocalNameValue>;
}

export interface FormattingLineSpacingState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<PaddingBlockValue>;
}

export interface FormattingSubscriptState extends FormattingToggleButton {}

export interface FormattingSuperscriptState extends FormattingToggleButton {}

export interface FormattingStrikethroughState extends FormattingToggleButton {}

export interface FormattingTextAlignState {
	disabled: boolean;
	hasUnset: boolean;
	values: Set<TextAlignValue>;
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
	backgroundColor?: BackgroundColorValue | null;
	bold?: FormattingTogglePressed;
	code?: FormattingTogglePressed;
	color?: ColorValue | null;
	fontFamily?: FontFamilyValue | null;
	fontSize?: FontSizeValue | null;
	indentation?: TextIndentValue | null;
	italic?: FormattingTogglePressed;
	letterSpacing?: LetterSpacingValue | null;
	lineHeight?: LineHeightValue | null;
	lineLocalName?: FormattingLineLocalNameValue;
	lineSpacing?: PaddingBlockValue | null;
	subscript?: FormattingTogglePressed;
	superscript?: FormattingTogglePressed;
	strikethrough?: FormattingTogglePressed;
	textAlign?: TextAlignValue | null;
	underline?: FormattingTogglePressed;
}

export type OnFormattingChangeCallbackFn = (params: FormattingActionState) => void;

export interface FormattingConfigPortProps {
	readonly whenMixed: FormattingWhenMixed;

	updateState(params: UpdateStateParams): void;
	onFormattingChange(callback: OnFormattingChangeCallbackFn): () => void;
}

export interface FormattingConfigPort extends FormattingConfigPortProps {}

export type OnBackgroundColorUpdateCallbackFn = (value: FormattingBackgroundColorState) => void;
export type OnBoldUpdateCallbackFn = (value: FormattingBoldState) => void;
export type OnCodeUpdateCallbackFn = (value: FormattingCodeState) => void;
export type OnColorUpdateCallbackFn = (value: FormattingColorState) => void;
export type OnFontFamilyUpdateCallbackFn = (value: FormattingFontFamilyState) => void;
export type OnFontSizeUpdateCallbackFn = (value: FormattingFontSizeState) => void;
export type OnIndentationUpdateCallbackFn = (value: FormattingIndentationState) => void;
export type OnItalicUpdateCallbackFn = (value: FormattingItalicState) => void;
export type OnLetterSpacingUpdateCallbackFn = (value: FormattingLetterSpacingState) => void;
export type OnLineHeightUpdateCallbackFn = (value: FormattingLineHeightState) => void;
export type OnLineLocalNameUpdateCallbackFn = (value: FormattingLineLocalNameState) => void;
export type OnLineSpacingUpdateCallbackFn = (value: FormattingLineSpacingState) => void;
export type OnSubscriptUpdateCallbackFn = (value: FormattingSubscriptState) => void;
export type OnSuperscriptUpdateCallbackFn = (value: FormattingSuperscriptState) => void;
export type OnStrikethroughUpdateCallbackFn = (value: FormattingStrikethroughState) => void;
export type OnTextAlignUpdateCallbackFn = (value: FormattingTextAlignState) => void;
export type OnUnderlineUpdateCallbackFn = (value: FormattingUnderlineState) => void;
export type OnRemoveLineUpdateCallbackFn = (value: FormattingRemoveLineState) => void;
export type OnRemoveTextUpdateCallbackFn = (value: FormattingRemoveTextState) => void;

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

	onBackgroundColorUpdate(callback: OnBackgroundColorUpdateCallbackFn): () => void;
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

	setBackgroundColor(backgroundColor: BackgroundColorValue | null): void;
	toggleBold(): void;
	toggleCode(): void;
	setColor(color: ColorValue | null): void;
	setFontFamily(fontFamily: FontFamilyValue | null): void;
	setFontSize(fontSize: FontSizeValue | null): void;
	setIndentation(indentation: TextIndentValue | null): void;
	toggleItalic(): void;
	setLetterSpacing(letterSpacing: LetterSpacingValue | null): void;
	setLineHeight(lineHeight: LineHeightValue | null): void;
	setLineLocalName(lineLocalName: FormattingLineLocalNameValue): void;
	setLineSpacing(lineSpacing: PaddingBlockValue | null): void;
	toggleSubscript(): void;
	toggleSuperscript(): void;
	toggleStrikethrough(): void;
	setTextAlign(textAlign: TextAlignValue | null): void;
	toggleUnderline(): void;
	removeLineFormat(): void;
	removeTextFormat(): void;
}

export interface FormattingPublicPort extends FormattingPublicPortProps {}

export interface FormattingAdapter {
	configPort: FormattingConfigPort;
	publicPort: FormattingPublicPort;
}

export interface FormattingSettings {
	whenMixed?: FormattingWhenMixed;
}

export interface CreateFormattingAdapterParams extends CreateAdapterParams<FormattingSettings> {}

export interface CreateFormattingAdapterResult extends FormattingAdapter {}
