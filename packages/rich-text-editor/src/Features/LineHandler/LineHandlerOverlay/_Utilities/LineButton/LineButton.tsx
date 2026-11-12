import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";

interface LineButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {}

export const LineButton = (props: LineButtonProps) => {
	const buttonProps = omit(props, "class");

	return (
		<button type="button" class={["btn-menu-trigger rounded-sm p-1", props.class]} {...buttonProps}>
			{props.children}
		</button>
	);
};
