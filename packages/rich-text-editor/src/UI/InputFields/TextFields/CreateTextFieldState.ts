import { createSignal, merge, onSettled } from "solid-js";

import type { HTMLTextFieldElement, TextFieldControls, TextFieldStateHandle } from "./_Utilities";
import {
	type CreateTextFieldControllerParams,
	createTextFieldController,
} from "./CreateTextFieldController";

export type CreateTextFieldStateParams = CreateTextFieldControllerParams;

export type CreateTextFieldStateResult<TextField extends HTMLTextFieldElement> = [
	TextFieldStateHandle,
	TextFieldControls<TextField>,
];

/**
 * Wraps {@link createTextFieldController}, trading direct `element` access
 * for a `value`/`setValue` signal pair. The element never leaves this
 * function, so `setValue`/`reset` are the only places that can ever write
 * to it — that's what keeps the signal from drifting out of sync with it.
 */
export const createTextFieldState = <TextField extends HTMLTextFieldElement>(
	props: CreateTextFieldStateParams,
): CreateTextFieldStateResult<TextField> => {
	const finalProps = merge({ defaultValue: "" }, props);

	const [handle, controls] = createTextFieldController<TextField>(props);

	const [value, setValue] = createSignal(finalProps.defaultValue);
	const [state, setState] = createSignal(handle.checkValidity());

	handle.onStateChange(setState);

	const commitValue = (nextValue: string) => {
		handle.element.value = nextValue;
		setValue(nextValue);
	};

	const textFieldStateHandle: TextFieldStateHandle = {
		get id() {
			return handle.id;
		},
		value,
		setValue: commitValue,
		state,
		validate: () => handle.validate(),
		checkValidity: () => handle.checkValidity(),
		onStateChange: (callback) => handle.onStateChange(callback),

		reset() {
			handle.reset();
			setValue(handle.element.value);
		},
	};

	onSettled(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		handle.element.addEventListener("input", () => setValue(handle.element.value), { signal });

		return () => {
			abortController.abort();
		};
	});

	return [textFieldStateHandle, controls];
};
