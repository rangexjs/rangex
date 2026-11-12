import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";

import { SelectDropdown, type SelectDropdownOption, type SelectDropdownProps } from "#ui";

export interface OptionDropdownOption<Option> extends SelectDropdownOption<Option> {}

export interface OptionDropdownProps<Option> extends SelectDropdownProps<Option> {
	label: string;
	class?: JSX.ClassValue;
}

export const OptionDropdown = <Option,>(props: OptionDropdownProps<Option>) => {
	const selectDropdownProps = omit(props, "label", "class");

	return (
		<div class={["flex flex-col gap-1", props.class]}>
			<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">{props.label}</span>
			<SelectDropdown<Option> {...selectDropdownProps} />
		</div>
	);
};
