import type { Accessor, JSX, Setter } from "solid-js";
import type { InputFieldErrorState, InputFieldState } from "../../_Utilities";

export type CheckboxErrorState = InputFieldErrorState;

export type CheckboxState = InputFieldState;

export interface CheckboxErrorRestriction {
	required?: { value: boolean; message?: JSX.Element };
}

export type OnStateChangeCallbackFn = (state: CheckboxState) => void;

export type OnStateChangeFn = (callback: OnStateChangeCallbackFn) => () => void;

export type StateChangeListeners = Set<OnStateChangeCallbackFn>;

export interface CheckboxHandle {
	readonly id: string;
	element: HTMLInputElement;
	validate: () => void;
	reset: () => void;
	checkValidity: () => CheckboxState;
	onStateChange: OnStateChangeFn;
}

export interface CheckboxControls {
	id: string;
	defaultChecked: boolean;
	setCheckbox: Setter<HTMLInputElement | null>;
}

export interface CheckboxStateHandle {
	readonly id: string;
	checked: Accessor<boolean>;
	setChecked: (checked: boolean) => void;
	state: Accessor<CheckboxState>;
	validate: () => void;
	reset: () => void;
	checkValidity: () => CheckboxState;
	onStateChange: OnStateChangeFn;
}
