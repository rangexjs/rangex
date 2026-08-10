import { type JSX, splitProps } from "solid-js";
import type { TextFieldControls } from "./_Utilities";

interface InputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"ref" | "id" | "type" | "value"
	> {}

interface InputTextFieldProps
	extends InputProps,
		TextFieldControls<HTMLInputElement> {
	type: "text" | "tel" | "email" | "password";
}

export const InputTextField = (props: InputTextFieldProps) => {
	const [controls, inputProps] = splitProps(props, [
		"setTextField",
		"defaultValue",
	]);

	return (
		<input
			ref={(el) => {
				controls.setTextField(el);
			}}
			value={controls.defaultValue}
			{...inputProps}
		/>
	);
};
