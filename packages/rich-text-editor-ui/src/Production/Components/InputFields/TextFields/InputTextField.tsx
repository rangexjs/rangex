import { type JSX, onMount, splitProps } from "solid-js";
import type { TextFieldControls } from "./_Utilities";
import { createTextFieldStateManager } from "./CreateTextFieldStateManager";

interface InputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"ref" | "type" | "value"
	> {}

interface InputTextFieldProps
	extends InputProps,
		TextFieldControls<HTMLInputElement> {
	type: "text" | "tel" | "email" | "password";
}

export const InputTextField = (props: InputTextFieldProps) => {
	const [textFieldControls, inputProps] = splitProps(props, [
		"fieldValue",
		"valueChangeListeners",
		"setTextFieldHandler",
		"error",
		"onStateChange",
		"validateOnChange",
	]);

	let internalInput: HTMLInputElement;

	const { value, onMountCallback, setTextFieldHandler } =
		createTextFieldStateManager(textFieldControls);

	onMount(() => {
		onMountCallback(internalInput);
	});

	return (
		<input
			ref={(input) => {
				internalInput = input;
				setTextFieldHandler(input);
			}}
			value={value()}
			{...inputProps}
		/>
	);
};
