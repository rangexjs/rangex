import type { JSX } from "@solidjs/web";
import { omit, untrack } from "solid-js";
import type { TextFieldControls } from "./_Utilities";

interface TextAreaProps
	extends Omit<
		JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"ref" | "id" | "value" | "defaultValue"
	> {}

interface InputTextFieldProps
	extends TextAreaProps,
		TextFieldControls<HTMLTextAreaElement> {}

export const TextAreaField = (props: InputTextFieldProps) => {
	const inputProps = omit(props, "setTextField", "defaultValue");

	return (
		<textarea
			ref={(textArea) => {
				untrack(() => {
					textArea.value = props.defaultValue;
					props.setTextField(textArea);
				});
			}}
			{...inputProps}
		/>
	);
};
