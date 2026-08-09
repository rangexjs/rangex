import { createUniqueId, For } from "solid-js";
import { Icon } from "../../../Icon";

export interface OptionDropdownOption<Option extends string> {
	label: string;
	value: NoInfer<Option>;
}

export interface OptionDropdownProps<Option extends string> {
	label: string;
	value: NoInfer<Option>;
	options: OptionDropdownOption<Option>[];
	onSelect: (value: NoInfer<Option>) => void;
	class?: string;
}

export const OptionDropdown = <Option extends string>(
	props: OptionDropdownProps<Option>,
) => {
	const popoverId = createUniqueId();

	const selectedLabel = () => {
		const selectedOption = props.options.find(
			(option) => option.value === props.value,
		);

		if (!selectedOption) {
			throw new Error("Value must be one of the given options.");
		}

		return selectedOption.label;
	};

	return (
		<div class="flex flex-col gap-1" classList={{ [props.class ?? ""]: true }}>
			<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
				{props.label}
			</span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-200 px-2 py-1 font-medium text-neutral-800 text-xs transition-colors hover:bg-neutral-50 active:border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:active:border-neutral-500 dark:hover:bg-neutral-800"
				classList={{
					"[&:has(~:popover-open)]:rounded-b-none [&:has(~:popover-open)]:border-b-neutral-200 [&:has(~:popover-open)]:dark:border-b-neutral-700": true,
				}}
			>
				<span class="truncate">{selectedLabel()}</span>
				<Icon
					name="CaretDown"
					class="size-2 shrink-0 text-neutral-400 dark:text-neutral-500"
				/>
			</button>
			<div
				id={popoverId}
				popover="auto"
				class="scrollbar-thin max-h-48 w-[anchor-size(width)] overflow-y-auto rounded-b-md border-neutral-200 border-r border-b border-l bg-white shadow-lg [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-800"
			>
				<For each={props.options}>
					{(option) => (
						<button
							type="button"
							commandfor={popoverId}
							command="hide-popover"
							class="w-full border border-transparent px-2 py-1 text-left font-medium text-neutral-600 text-xs leading-normal transition-colors hover:border-neutral-100 hover:bg-neutral-100 active:border-neutral-200 dark:text-neutral-300 dark:active:border-neutral-500 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
							classList={{ hidden: option.value === props.value }}
							on:click={() => {
								props.onSelect(option.value);
							}}
						>
							{option.label}
						</button>
					)}
				</For>
			</div>
		</div>
	);
};
