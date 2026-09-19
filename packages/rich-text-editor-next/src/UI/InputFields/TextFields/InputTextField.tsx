import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { TextFieldControls } from "./_Utilities";

interface InputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"ref" | "id" | "type" | "value" | "defaultValue"
	> {}

interface InputTextFieldProps
	extends InputProps,
		TextFieldControls<HTMLInputElement> {
	type: "text" | "tel" | "email" | "password";
}

export const InputTextField = (props: InputTextFieldProps) => {
	const inputProps = omit(props, "setTextField", "defaultValue");

	return (
		<input
			ref={(el) => {
				el.value = props.defaultValue;
				props.setTextField(el);
			}}
			{...inputProps}
		/>
	);
};
