import {
	createSignal,
	createUniqueId,
	mergeProps,
	onCleanup,
	onMount,
} from "solid-js";
import { showInputFieldError } from "../_Utilities";
import {
	type CheckboxControls,
	type CheckboxErrorRestriction,
	type CheckboxHandle,
	type CheckboxState,
	getErrorState,
	type StateChangeListeners,
} from "./_Utilities";

export interface CreateCheckboxControllerParams {
	defaultChecked?: boolean;
	error?: CheckboxErrorRestriction;
	validateOnChange?: boolean;
}

export type CreateCheckboxControllerResult = [CheckboxHandle, CheckboxControls];

export const createCheckboxController = (
	props: CreateCheckboxControllerParams,
): CreateCheckboxControllerResult => {
	const finalProps = mergeProps(
		{ defaultChecked: false, error: {}, validateOnChange: false },
		props,
	);

	const id = createUniqueId();
	const [checkbox, setCheckbox] = createSignal<HTMLInputElement | null>(null);

	let state: CheckboxState = {
		isDirty: false,
		...getErrorState(finalProps.defaultChecked, finalProps.error),
	};

	const stateChangeListeners: StateChangeListeners = new Set();

	const emitStateChange = () => {
		const field = checkbox();
		field?.setAttribute("data-invalid", `${showInputFieldError(state)}`);

		for (const listener of stateChangeListeners) {
			listener(state);
		}
	};

	const getCheckbox = () => {
		const field = checkbox();

		if (!field) {
			throw new Error("Can't access to the checkbox before mount.");
		}

		return field;
	};

	const currentChecked = () => checkbox()?.checked ?? finalProps.defaultChecked;

	const checkboxHandle: CheckboxHandle = {
		get id() {
			return id;
		},

		get element() {
			const field = getCheckbox();

			return field;
		},

		validate() {
			state = {
				isDirty: true,
				...getErrorState(this.element.checked, finalProps.error),
			};

			emitStateChange();
		},

		reset() {
			this.element.checked = finalProps.defaultChecked;
			state = {
				isDirty: false,
				...getErrorState(this.element.checked, finalProps.error),
			};

			emitStateChange();
		},

		checkValidity() {
			const { hasError, message } = getErrorState(
				currentChecked(),
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

	const checkboxControls: CheckboxControls = {
		id,
		defaultChecked: finalProps.defaultChecked,
		setCheckbox,
	};

	const onChange = () => {
		if (!finalProps.validateOnChange) {
			return;
		}

		checkboxHandle.validate();
	};

	onMount(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		const field = getCheckbox();

		field.addEventListener("change", onChange, { signal });

		onCleanup(() => {
			abortController.abort();
		});
	});

	return [checkboxHandle, checkboxControls];
};
