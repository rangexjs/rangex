import { createUniqueId, merge, onSettled } from "solid-js";
import { showInputFieldError } from "../_Utilities";
import {
	getErrorState,
	type HTMLTextFieldElement,
	type StateChangeListeners,
	type TextFieldControls,
	type TextFieldErrorRestriction,
	type TextFieldHandle,
	type TextFieldState,
} from "./_Utilities";

export type ValidationOption = "blur:changed" | "input:dirty";
export type ValidateOn = ValidationOption[];

export interface CreateTextFieldControllerParams {
	defaultValue?: string;
	error?: TextFieldErrorRestriction;
	validateOn?: ValidateOn;
}

export type CreateTextFieldControllerResult<
	TextField extends HTMLTextFieldElement,
> = [TextFieldHandle<TextField>, TextFieldControls<TextField>];

export const createTextFieldController = <
	TextField extends HTMLTextFieldElement,
>(
	props: CreateTextFieldControllerParams,
): CreateTextFieldControllerResult<TextField> => {
	const defaultValidateOn: ValidateOn = [];

	const finalProps = merge(
		{ defaultValue: "", error: {}, validateOn: defaultValidateOn },
		props,
	);

	const id = createUniqueId();
	let localTextField: TextField | null;

	const setTextField = (textField: TextField) => {
		localTextField = textField;
	};

	let textChangedDuringFocus = false;

	let state: TextFieldState = {
		isDirty: false,
		...getErrorState(finalProps.defaultValue, finalProps.error),
	};

	const stateChangeListeners: StateChangeListeners = new Set();

	const emitStateChange = () => {
		localTextField?.setAttribute(
			"data-invalid",
			`${showInputFieldError(state)}`,
		);

		for (const listener of stateChangeListeners) {
			listener(state);
		}
	};

	const getTextField = () => {
		if (!localTextField) {
			throw new Error("Can't access to the TextField before mount.");
		}

		return localTextField;
	};

	const currentValue = () => localTextField?.value ?? finalProps.defaultValue;

	const textFieldHandle: TextFieldHandle<TextField> = {
		get id() {
			return id;
		},

		get element() {
			const field = getTextField();

			return field;
		},

		validate() {
			state = {
				isDirty: true,
				...getErrorState(this.element.value, finalProps.error),
			};

			emitStateChange();
		},

		reset() {
			this.element.value = finalProps.defaultValue;
			state = {
				isDirty: false,
				...getErrorState(this.element.value, finalProps.error),
			};

			emitStateChange();
		},

		checkValidity() {
			const { hasError, message } = getErrorState(
				currentValue(),
				finalProps.error,
			);

			return { hasError, message, isDirty: state.isDirty };
		},

		onStateChange(callback) {
			stateChangeListeners.add(callback);

			return () => stateChangeListeners.delete(callback);
		},
	};

	const textFieldControls: TextFieldControls<TextField> = {
		id,
		defaultValue: finalProps.defaultValue,
		setTextField,
	};

	const onFocus = () => {
		textChangedDuringFocus = false;
	};

	const onBlur = () => {
		if (!textChangedDuringFocus) {
			return;
		}

		if (!finalProps.validateOn.includes("blur:changed")) {
			return;
		}

		textFieldHandle.validate();
	};

	const onInput = () => {
		textChangedDuringFocus = true;
		const currentState = textFieldHandle.checkValidity();

		// Always revalidate if the previous state had an error, but the new one is valid
		if (showInputFieldError(state) && !currentState.hasError) {
			textFieldHandle.validate();
			return;
		}

		if (!finalProps.validateOn.includes("input:dirty")) {
			return;
		}

		if (!state.isDirty) {
			return;
		}

		textFieldHandle.validate();
	};

	onSettled(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		const textField = getTextField();

		textField.addEventListener("focus", onFocus, { signal });

		textField.addEventListener("blur", onBlur, { signal });

		textField.addEventListener("input", onInput, { signal });

		return () => {
			abortController.abort();
		};
	});

	return [textFieldHandle, textFieldControls];
};
