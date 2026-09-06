import type { JSX } from "@solidjs/web/jsx-runtime";
import { omit } from "solid-js";
import { Icon } from "../../Icon";
import type { CheckboxControls } from "./_Utilities";

interface InputProps
	extends Omit<
		JSX.InputHTMLAttributes<HTMLInputElement>,
		"ref" | "id" | "type" | "checked" | "defaultChecked"
	> {}

export interface CheckboxProps extends InputProps, CheckboxControls {}

export const Checkbox = (props: CheckboxProps) => {
	const inputProps = omit(props, "setCheckbox", "defaultChecked", "class");

	return (
		<span class="relative inline-block h-min leading-0">
			<input
				ref={(el) => {
					props.setCheckbox(el);
				}}
				type="checkbox"
				checked={props.defaultChecked}
				class={[
					"peer size-4.5 cursor-pointer appearance-none rounded-sm border border-neutral-400 bg-neutral-100 ring-primary-500/20 transition-all checked:border-primary-500 checked:bg-primary-500/65 focus:ring-3 data-[invalid=true]:border-red-600 data-[invalid=true]:ring-red-600/20 dark:border-neutral-500 dark:bg-neutral-800",
					props.class,
				]}
				{...inputProps}
			/>
			<Icon
				name="Check"
				class="-translate-1/2 pointer-events-none absolute top-1/2 left-1/2 hidden size-3 text-white peer-checked:block"
			/>
		</span>
	);
};
