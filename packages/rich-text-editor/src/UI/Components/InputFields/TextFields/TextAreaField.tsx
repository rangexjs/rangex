import { type JSX, onMount, splitProps } from "solid-js";
import type { TextFieldControls } from "./_Utilities";
import { createTextFieldStateManager } from "./CreateTextFieldStateManager";

interface TextAreaProps
	extends Omit<
		JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"ref" | "value"
	> {}

interface InputTextFieldProps
	extends TextAreaProps,
		TextFieldControls<HTMLTextAreaElement> {}

export const TextAreaField = (props: InputTextFieldProps) => {
	const [textFieldControls, inputProps] = splitProps(props, [
		"fieldValue",
		"valueChangeListeners",
		"setTextFieldHandler",
		"error",
		"onStateChange",
		"validateOnChange",
	]);

	let internalTextArea: HTMLTextAreaElement;

	const { value, onMountCallback, setTextFieldHandler } =
		createTextFieldStateManager(textFieldControls);

	onMount(() => {
		onMountCallback(internalTextArea);
	});

	return (
		<textarea
			ref={(textArea) => {
				internalTextArea = textArea;
				setTextFieldHandler(textArea);
			}}
			value={value()}
			{...inputProps}
		/>
	);
};
