import type { JSX, Signal } from "solid-js";

export type TextFieldErrorVariant =
	| "required"
	| "min"
	| "max"
	| "minlength"
	| "maxlength"
	| "pattern"
	| "custom";

export interface TextFieldErrorRestriction {
	required?: { value: boolean; message?: JSX.Element };
	min?: { value: number; locale: string; message?: JSX.Element };
	max?: { value: number; locale: string; message?: JSX.Element };
	minLength?: { value: number; message?: JSX.Element };
	maxLength?: { value: number; message?: JSX.Element };
	patterns?: { value: RegExp; message?: JSX.Element }[];
	custom?: { isValid: (value: string) => boolean; message?: JSX.Element };
	priority?: TextFieldErrorVariant[];
	defaultMessage?: JSX.Element;
}

export interface TextFieldErrorState {
	hasError: boolean;
	message: JSX.Element;
}

export interface TextFieldState extends TextFieldErrorState {
	showError: boolean;
}

export type ValueChangeListeners = Set<() => void>;

export type HTMLTextFieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface TextFieldHandler<TextField extends HTMLTextFieldElement> {
	textField: TextField;
	validate: () => void;
	reset: () => void;
	checkValidity: () => TextFieldState;
}

export interface TextFieldControls<TextField extends HTMLTextFieldElement> {
	fieldValue: Signal<string>;
	valueChangeListeners: ValueChangeListeners;
	setTextFieldHandler: (params: TextFieldHandler<TextField>) => void;
	error: TextFieldErrorRestriction;
	onStateChange: (error: TextFieldState) => void;
	validateOnChange: boolean;
}
