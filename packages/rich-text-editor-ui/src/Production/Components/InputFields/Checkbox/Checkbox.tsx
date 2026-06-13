import {
	createEffect,
	createSignal,
	type JSX,
	onCleanup,
	onMount,
	splitProps,
} from "solid-js";
import { Icon } from "../../Icon";
import type {
	CheckboxControls,
	CheckboxErrorRestriction,
	CheckboxErrorState,
	CheckboxState,
} from "./_Utilities";

export const getErrorState = (
	checked: boolean,
	errors: CheckboxErrorRestriction,
): CheckboxErrorState => {
	if (errors.required?.value) {
		const hasError = !checked;
		const message = checked ? null : errors.required.message;

		return { hasError, message };
	}

	return { hasError: false, message: null };
};

interface InputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"ref" | "type" | "checked" | "classList"
	> {}

export interface CheckboxProps extends InputProps, CheckboxControls {}

export const Checkbox = (props: CheckboxProps) => {
	const [checkboxControls, inputProps] = splitProps(props, [
		"fieldChecked",
		"checkedChangeListeners",
		"setCheckboxHandler",
		"error",
		"onStateChange",
		"validateOnChange",
	]);

	let internalInput: HTMLInputElement;

	const [checked, setChecked] = checkboxControls.fieldChecked;
	const [isDirty, setIsDirty] = createSignal(false);

	const onStateChange = (checkbox: HTMLInputElement, state: CheckboxState) => {
		checkbox.setAttribute("data-invalid", `${state.showError}`);
		checkboxControls.onStateChange(state);
	};

	onMount(() => {
		if (!internalInput) {
			throw new Error("TextField can't be null.");
		}

		const controller = new AbortController();
		const { signal } = controller;

		onStateChange(internalInput, {
			showError: false,
			...getErrorState(checked(), checkboxControls.error),
		});

		const onInput = () => {
			setIsDirty(true);
			setChecked(internalInput.checked);

			for (const listener of checkboxControls.checkedChangeListeners) {
				listener();
			}
		};

		internalInput.addEventListener("input", onInput, { signal });

		onCleanup(() => {
			controller.abort();
		});
	});

	createEffect(() => {
		const { hasError, message } = getErrorState(
			checked(),
			checkboxControls.error,
		);

		const showError = isDirty() && hasError;

		onStateChange(internalInput, { showError, hasError, message });
	});

	const setTextFieldHandler = () => {
		checkboxControls.setCheckboxHandler({
			checkbox: internalInput,
			reset: () => {
				setIsDirty(false);
				onStateChange(internalInput, {
					showError: false,
					hasError: false,
					message: null,
				});
			},
			validate: () => {
				const { hasError, message } = getErrorState(
					checked(),
					checkboxControls.error,
				);
				setIsDirty(true);

				onStateChange(internalInput, {
					showError: hasError,
					hasError,
					message,
				});
			},
			checkValidity() {
				const { hasError, message } = getErrorState(
					checked(),
					checkboxControls.error,
				);
				const showError = isDirty() && hasError;

				return { showError, hasError, message };
			},
		});
	};

	return (
		<span class="relative inline-block h-min leading-0">
			<input
				{...inputProps}
				type="checkbox"
				ref={(input) => {
					internalInput = input;
					setTextFieldHandler();
				}}
				checked={checked()}
				class="size-4.5 cursor-pointer appearance-none rounded-sm border border-neutral-400 bg-neutral-100 ring-primary-500/20 transition-all checked:border-primary-500 checked:bg-primary-500/65 focus:ring-3 data-[invalid=true]:border-red-600 data-[invalid=true]:ring-red-600/20"
				classList={{
					[inputProps.class ?? ""]: true,
				}}
			/>
			<Icon
				name="Check"
				class="-translate-1/2 pointer-events-none absolute top-1/2 left-1/2 size-3 text-white"
				classList={{ hidden: !checked() }}
			/>
		</span>
	);
};
