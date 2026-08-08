import {
	createSignal,
	createUniqueId,
	mergeProps,
	onCleanup,
	onMount,
} from "solid-js";
import {
	getErrorState,
	type HTMLTextFieldElement,
	type StateChangeListeners,
	shouldShowError,
	type TextFieldControls,
	type TextFieldErrorRestriction,
	type TextFieldHandle,
	type TextFieldState,
} from "./_Utilities";

export type ValidationOption = "change" | "input:dirty";
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

	const finalProps = mergeProps(
		{ defaultValue: "", error: {}, validateOn: defaultValidateOn },
		props,
	);

	const id = createUniqueId();
	const [textField, setTextField] = createSignal<TextField | null>(null);

	let state: TextFieldState = {
		isDirty: false,
		...getErrorState(finalProps.defaultValue, finalProps.error),
	};

	const stateChangeListeners: StateChangeListeners = new Set();

	const emitStateChange = () => {
		const field = textField();
		field?.setAttribute("data-invalid", `${shouldShowError(state)}`);

		for (const listener of stateChangeListeners) {
			listener(state);
		}
	};

	const getTextField = () => {
		const field = textField();

		if (!field) {
			throw new Error("Can't access to the TextField before mount.");
		}

		return field;
	};

	const currentValue = () => textField()?.value ?? finalProps.defaultValue;

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
			callback(this.checkValidity());
			stateChangeListeners.add(callback);

			return () => stateChangeListeners.delete(callback);
		},
	};

	const textFieldControls: TextFieldControls<TextField> = {
		id,
		defaultValue: finalProps.defaultValue,
		setTextField,
	};

	const onChange = () => {
		if (!finalProps.validateOn.includes("change")) {
			return;
		}

		textFieldHandle.validate();
	};

	const onInput = () => {
		const currentState = textFieldHandle.checkValidity();

		// Always revalidate if the previous state was an error, but the new one is valid
		if (shouldShowError(state) && !currentState.hasError) {
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

	onMount(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		const textField = getTextField();

		textField.addEventListener("change", onChange, { signal });

		textField.addEventListener("input", onInput, { signal });

		onCleanup(() => {
			abortController.abort();
		});
	});

	return [textFieldHandle, textFieldControls];
};
