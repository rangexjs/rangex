import type { JSX } from "solid-js";

export interface InputFieldErrorState {
	hasError: boolean;
	message: JSX.Element;
}

export interface InputFieldState extends InputFieldErrorState {
	isDirty: boolean;
}
