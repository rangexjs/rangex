import type {
	BackgroundColorValue,
	ColorValue,
	FontFamilyValue,
	FontSizeValue,
	FormattingLineLocalNameValue,
	FormattingPublicPort,
	FormattingTogglePressed,
	LetterSpacingValue,
	LineHeightValue,
	PaddingBlockValue,
	TextAlignValue,
	TextIndentValue,
} from "@rangex/editor/formatting";
import type { Accessor } from "solid-js";

export type FromFormattingToReactivePort<T, TReactivePort> = T extends FormattingPublicPort
	? TReactivePort
	: undefined;

export interface ReactiveFormattingToggleButton {
	checked: Accessor<boolean>;
	pressed: Accessor<FormattingTogglePressed>;
	disabled: Accessor<boolean>;
}

export interface ReactiveFormattingValuePort<TValue> {
	disabled: Accessor<boolean>;
	values: Accessor<Set<TValue>>;
}

export interface ReactiveBackgroundColorPort extends ReactiveFormattingValuePort<BackgroundColorValue> {}

export interface ReactiveColorPort extends ReactiveFormattingValuePort<ColorValue> {}

export interface ReactiveFontFamilyPort extends ReactiveFormattingValuePort<FontFamilyValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveFontSizePort extends ReactiveFormattingValuePort<FontSizeValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveIndentationPort extends ReactiveFormattingValuePort<TextIndentValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveLetterSpacingPort extends ReactiveFormattingValuePort<LetterSpacingValue> {}

export interface ReactiveLineHeightPort extends ReactiveFormattingValuePort<LineHeightValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveLineLocalNamePort extends ReactiveFormattingValuePort<FormattingLineLocalNameValue> {}

export interface ReactiveLineSpacingPort extends ReactiveFormattingValuePort<PaddingBlockValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveTextAlignPort extends ReactiveFormattingValuePort<TextAlignValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveRemoveFormatPort {
	disabled: Accessor<boolean>;
}
