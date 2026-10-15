import type {
	FormattingBackgroundColorValue,
	FormattingColorValue,
	FormattingFontFamilyValue,
	FormattingFontSizeValue,
	FormattingIndentationValue,
	FormattingLetterSpacingValue,
	FormattingLineHeightValue,
	FormattingLineLocalNameValue,
	FormattingLineSpacingValue,
	FormattingPublicPort,
	FormattingTextAlignValue,
	FormattingTogglePressed,
} from "@rangex/editor/formatting";
import type { Accessor } from "solid-js";

export type FromFormattingToReactivePort<T, TReactivePort> =
	T extends FormattingPublicPort ? TReactivePort : undefined;

export interface ReactiveFormattingToggleButton {
	checked: Accessor<boolean>;
	pressed: Accessor<FormattingTogglePressed>;
	disabled: Accessor<boolean>;
}

export interface ReactiveFormattingValuePort<TValue> {
	disabled: Accessor<boolean>;
	values: Accessor<Set<TValue>>;
}

export interface ReactiveBackgroundColorPort
	extends ReactiveFormattingValuePort<FormattingBackgroundColorValue> {}

export interface ReactiveColorPort
	extends ReactiveFormattingValuePort<FormattingColorValue> {}

export interface ReactiveFontFamilyPort
	extends ReactiveFormattingValuePort<FormattingFontFamilyValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveFontSizePort
	extends ReactiveFormattingValuePort<FormattingFontSizeValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveIndentationPort
	extends ReactiveFormattingValuePort<FormattingIndentationValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveLetterSpacingPort
	extends ReactiveFormattingValuePort<FormattingLetterSpacingValue> {}

export interface ReactiveLineHeightPort
	extends ReactiveFormattingValuePort<FormattingLineHeightValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveLineLocalNamePort
	extends ReactiveFormattingValuePort<FormattingLineLocalNameValue> {}

export interface ReactiveLineSpacingPort
	extends ReactiveFormattingValuePort<FormattingLineSpacingValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveTextAlignPort
	extends ReactiveFormattingValuePort<FormattingTextAlignValue> {
	hasUnset: Accessor<boolean>;
}

export interface ReactiveRemoveFormatPort {
	disabled: Accessor<boolean>;
}
