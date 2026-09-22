import type { JSX } from "@solidjs/web";

export interface InputFieldErrorState {
	hasError: boolean;
	message: JSX.Element;
}

export interface InputFieldState extends InputFieldErrorState {
	isDirty: boolean;
}
