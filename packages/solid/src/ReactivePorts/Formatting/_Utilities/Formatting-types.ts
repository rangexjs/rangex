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
	extends ReactiveFormattingValuePort<FormattingFontFamilyValue> {}

export interface ReactiveFontSizePort
	extends ReactiveFormattingValuePort<FormattingFontSizeValue> {}

export interface ReactiveIndentationPort
	extends ReactiveFormattingValuePort<FormattingIndentationValue> {}

export interface ReactiveLetterSpacingPort
	extends ReactiveFormattingValuePort<FormattingLetterSpacingValue> {}

export interface ReactiveLineHeightPort
	extends ReactiveFormattingValuePort<FormattingLineHeightValue> {}

export interface ReactiveLineLocalNamePort
	extends ReactiveFormattingValuePort<FormattingLineLocalNameValue> {}

export interface ReactiveLineSpacingPort
	extends ReactiveFormattingValuePort<FormattingLineSpacingValue> {}

export interface ReactiveTextAlignPort
	extends ReactiveFormattingValuePort<FormattingTextAlignValue> {}

export interface ReactiveRemoveFormatPort {
	disabled: Accessor<boolean>;
}
