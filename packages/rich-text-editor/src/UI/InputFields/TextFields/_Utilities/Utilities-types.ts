import type { JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";

import type { InputFieldErrorState, InputFieldState } from "../../_Utilities";

export type TextFieldErrorState = InputFieldErrorState;

export type TextFieldState = InputFieldState;

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

export type OnStateChangeCallbackFn = (state: TextFieldState) => void;

export type OnStateChangeFn = (callback: OnStateChangeCallbackFn) => () => void;

export type StateChangeListeners = Set<OnStateChangeCallbackFn>;

export type HTMLTextFieldElement = HTMLInputElement | HTMLTextAreaElement;

export interface TextFieldHandle<TextField extends HTMLTextFieldElement> {
	readonly id: string;
	element: TextField;
	validate: () => void;
	reset: () => void;
	checkValidity: () => TextFieldState;
	onStateChange: OnStateChangeFn;
}

export interface TextFieldControls<TextField extends HTMLTextFieldElement> {
	id: string;
	defaultValue: string;
	setTextField: (textField: TextField) => void;
}

export interface TextFieldStateHandle {
	readonly id: string;
	value: Accessor<string>;
	setValue: (value: string) => void;
	state: Accessor<TextFieldState>;
	validate: () => void;
	reset: () => void;
	checkValidity: () => TextFieldState;
	onStateChange: OnStateChangeFn;
}
