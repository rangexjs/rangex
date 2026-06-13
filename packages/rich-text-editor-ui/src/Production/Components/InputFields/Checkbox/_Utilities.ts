import type { JSX, Signal } from "solid-js";

export interface CheckboxErrorRestriction {
	required?: { value: boolean; message?: JSX.Element };
}

export interface CheckboxErrorState {
	hasError: boolean;
	message: JSX.Element;
}

export interface CheckboxState extends CheckboxErrorState {
	showError: boolean;
}

export type CheckedChangeListeners = Set<() => void>;

export interface CheckboxHandler {
	checkbox: HTMLInputElement;
	validate: () => void;
	reset: () => void;
	checkValidity: () => CheckboxState;
}

export interface CheckboxControls {
	fieldChecked: Signal<boolean>;
	checkedChangeListeners: CheckedChangeListeners;
	setCheckboxHandler: (params: CheckboxHandler) => void;
	error: CheckboxErrorRestriction;
	onStateChange: (error: CheckboxState) => void;
	validateOnChange: boolean;
}
