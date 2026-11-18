import type { JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";

import type { InputFieldErrorState, InputFieldState } from "../../_Utilities";

export type CheckboxErrorState = InputFieldErrorState;

export type CheckboxState = InputFieldState;

export interface CheckboxErrorRestriction {
	required?: { value: boolean; message?: JSX.Element };
}

export interface CheckboxControls {
	id: string;
	defaultChecked: boolean;
	setCheckbox: (checkbox: HTMLInputElement) => void;
}

export interface CheckboxHandle {
	readonly id: string;
	checked: Accessor<boolean>;
	setChecked: (checked: boolean) => void;
	state: Accessor<CheckboxState>;
	validate: () => void;
	reset: (checked?: boolean) => void;
	checkValidity: () => CheckboxState;
}
