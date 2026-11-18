import { createSignal, createUniqueId, merge, onSettled } from "solid-js";

import { showInputFieldError } from "../_Utilities";
import {
	type CheckboxControls,
	type CheckboxErrorRestriction,
	type CheckboxHandle,
	type CheckboxState,
	getErrorState,
} from "./_Utilities";

export interface CreateCheckboxControllerParams {
	defaultChecked?: boolean;
	error?: CheckboxErrorRestriction;
	validateOnChange?: boolean;
}

export type CreateCheckboxControllerResult = [CheckboxHandle, CheckboxControls];

const isCheckboxStateEqual = (prev: CheckboxState, next: CheckboxState) =>
	prev.isDirty === next.isDirty && prev.hasError === next.hasError && prev.message === next.message;

export const createCheckboxController = (
	props: CreateCheckboxControllerParams,
): CreateCheckboxControllerResult => {
	const finalProps = merge({ defaultChecked: false, error: {}, validateOnChange: false }, props);

	const id = createUniqueId();
	let localCheckbox: HTMLInputElement | null = null;

	const setCheckbox = (checkbox: HTMLInputElement) => {
		localCheckbox = checkbox;
	};

	const getCheckbox = () => {
		if (!localCheckbox) {
			throw new Error("Can't access to the checkbox before mount.");
		}

		return localCheckbox;
	};

	const [checked, setLocalChecked] = createSignal(finalProps.defaultChecked);

	const [state, setLocalState] = createSignal<CheckboxState>(
		{
			isDirty: false,
			...getErrorState(finalProps.defaultChecked, finalProps.error),
		},
		{ equals: isCheckboxStateEqual },
	);

	const commitState = (nextState: CheckboxState) => {
		setLocalState(nextState);
		localCheckbox?.setAttribute("data-invalid", `${showInputFieldError(nextState)}`);
	};

	const commitValidation = (nextChecked: boolean) => {
		const nextState: CheckboxState = {
			isDirty: true,
			...getErrorState(nextChecked, finalProps.error),
		};

		commitState(nextState);

		return nextState;
	};

	const checkboxHandle: CheckboxHandle = {
		get id() {
			return id;
		},

		checked,

		setChecked(nextChecked) {
			const checkbox = getCheckbox();

			checkbox.checked = nextChecked;
			setLocalChecked(nextChecked);
		},

		state,

		validate() {
			const nextState = commitValidation(checked());

			return nextState;
		},

		reset(nextChecked = finalProps.defaultChecked) {
			const checkbox = getCheckbox();

			checkbox.checked = nextChecked;
			setLocalChecked(nextChecked);

			commitState({
				isDirty: false,
				...getErrorState(nextChecked, finalProps.error),
			});
		},

		checkValidity() {
			const { hasError, message } = getErrorState(checked(), finalProps.error);

			return { hasError, message, isDirty: state().isDirty };
		},
	};

	const checkboxControls: CheckboxControls = {
		id,
		defaultChecked: finalProps.defaultChecked,
		setCheckbox,
	};

	const onChange = () => {
		const checkbox = getCheckbox();
		const nextChecked = checkbox.checked;

		setLocalChecked(nextChecked);

		if (!finalProps.validateOnChange) {
			return;
		}

		commitValidation(nextChecked);
	};

	onSettled(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		const checkbox = getCheckbox();

		checkbox.addEventListener("change", onChange, { signal });

		return () => {
			abortController.abort();
		};
	});

	return [checkboxHandle, checkboxControls];
};
