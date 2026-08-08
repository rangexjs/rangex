import { createSignal, mergeProps, onCleanup, onMount } from "solid-js";
import type { CheckboxControls, CheckboxStateHandle } from "./_Utilities";
import {
	type CreateCheckboxControllerParams,
	createCheckboxController,
} from "./CreateCheckboxController";

export type CreateCheckboxStateParams = CreateCheckboxControllerParams;

export type CreateCheckboxStateResult = [CheckboxStateHandle, CheckboxControls];

/**
 * Wraps {@link createCheckboxController}, trading direct `element` access
 * for a `checked`/`setChecked` signal pair. The element never leaves this
 * function, so `setChecked`/`reset` are the only places that can ever write
 * to it — that's what keeps the signal from drifting out of sync with it.
 */
export const createCheckboxState = (
	props: CreateCheckboxStateParams,
): CreateCheckboxStateResult => {
	const finalProps = mergeProps({ defaultChecked: false }, props);

	const [handle, controls] = createCheckboxController(props);

	const [checked, setChecked] = createSignal(finalProps.defaultChecked);
	const [state, setState] = createSignal(handle.checkValidity());

	handle.onStateChange(setState);

	const commitChecked = (nextChecked: boolean) => {
		handle.element.checked = nextChecked;
		setChecked(nextChecked);
	};

	const checkboxStateHandle: CheckboxStateHandle = {
		get id() {
			return handle.id;
		},
		checked,
		setChecked: commitChecked,
		state,
		validate: () => handle.validate(),
		checkValidity: () => handle.checkValidity(),
		onStateChange: (callback) => handle.onStateChange(callback),

		reset() {
			handle.reset();
			setChecked(handle.element.checked);
		},
	};

	onMount(() => {
		const abortController = new AbortController();
		const { signal } = abortController;

		handle.element.addEventListener(
			"change",
			() => setChecked(handle.element.checked),
			{ signal },
		);

		onCleanup(() => {
			abortController.abort();
		});
	});

	return [checkboxStateHandle, controls];
};
