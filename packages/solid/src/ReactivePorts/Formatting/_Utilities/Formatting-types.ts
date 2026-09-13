import type {
	FontFamilyOption,
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
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export type FromFormattingToReactivePort<T, TReactivePort> =
	T extends FormattingPublicPort ? TReactivePort : undefined;

export interface ReactiveFormattingToggleButton {
	checked: Accessor<boolean>;
	pressed: Accessor<FormattingTogglePressed>;
	disabled: Accessor<boolean>;

	toggle(): void;
}

export interface ReactiveFormattingValuePort<
	TValue,
	TSetValue extends TValue | null,
> {
	disabled: Accessor<boolean>;
	values: Accessor<Set<TValue>>;

	set(value: TSetValue): void;
}

export interface ReactiveBackgroundColorPort
	extends ReactiveFormattingValuePort<
		FormattingBackgroundColorValue,
		FormattingBackgroundColorValue | null
	> {}

export interface ReactiveColorPort
	extends ReactiveFormattingValuePort<
		FormattingColorValue,
		FormattingColorValue | null
	> {}

export interface ReactiveFontFamilyPort
	extends ReactiveFormattingValuePort<
		FormattingFontFamilyValue,
		FormattingFontFamilyValue | null
	> {
	readonly default: FormattingFontFamilyValue;
	readonly options: FontFamilyOption[];
}

export interface ReactiveFontSizePort
	extends ReactiveFormattingValuePort<
		FormattingFontSizeValue,
		FormattingFontSizeValue | null
	> {
	readonly default: FormattingFontSizeValue;
}

export interface ReactiveIndentationPort
	extends ReactiveFormattingValuePort<
		FormattingIndentationValue,
		FormattingIndentationValue
	> {
	readonly default: FormattingIndentationValue;
}

export interface ReactiveLetterSpacingPort
	extends ReactiveFormattingValuePort<
		FormattingLetterSpacingValue,
		FormattingLetterSpacingValue | null
	> {}

export interface ReactiveLineHeightPort
	extends ReactiveFormattingValuePort<
		FormattingLineHeightValue,
		FormattingLineHeightValue
	> {
	readonly default: FormattingLineHeightValue;
}

export interface ReactiveLineLocalNamePort
	extends ReactiveFormattingValuePort<
		FormattingLineLocalNameValue,
		FormattingLineLocalNameValue
	> {}

export interface ReactiveLineSpacingPort
	extends ReactiveFormattingValuePort<
		FormattingLineSpacingValue,
		FormattingLineSpacingValue
	> {
	readonly default: FormattingLineSpacingValue;
}

export interface ReactiveTextAlignPort
	extends ReactiveFormattingValuePort<
		FormattingTextAlignValue,
		FormattingTextAlignValue
	> {
	readonly default: FormattingTextAlignValue;
}

export interface ReactiveRemoveFormatPort {
	disabled: Accessor<boolean>;

	remove(): void;
}
