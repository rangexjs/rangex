import { type JSX, splitProps } from "solid-js";
import type { TextFieldControls } from "./_Utilities";

interface TextAreaProps
	extends Omit<
		JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"ref" | "id" | "value"
	> {}

interface InputTextFieldProps
	extends TextAreaProps,
		TextFieldControls<HTMLTextAreaElement> {}

export const TextAreaField = (props: InputTextFieldProps) => {
	const [ref, inputProps] = splitProps(props, ["setTextField", "defaultValue"]);

	return (
		<textarea
			ref={(textArea) => {
				ref.setTextField(textArea);
			}}
			value={ref.defaultValue}
			{...inputProps}
		/>
	);
};
