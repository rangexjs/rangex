import { createSignal, createUniqueId, For } from "solid-js";
import type { BlockAlignValue } from "../../../../PopoverControllers";
import { Icon, type IconName } from "../../../Icon";

const iconNameOptions: Record<BlockAlignValue, IconName> = {
	left: "AlignLeft",
	center: "AlignCenter",
	right: "AlignRight",
};

const labelOptions: Record<BlockAlignValue, string> = {
	left: "Align left",
	center: "Align center",
	right: "Align right",
};

const defaultOptions: BlockAlignValue[] = ["left", "center", "right"];

export interface BlockAlignProps {
	value: BlockAlignValue;
	options?: BlockAlignValue[];
	disabled?: boolean;
	onChange: (value: BlockAlignValue) => void;
	popoverRef?: (element: HTMLDivElement) => void;
}

export const BlockAlign = (props: BlockAlignProps) => {
	const popoverId = createUniqueId();

	const [checked, setChecked] = createSignal(false);

	const options = () => props.options ?? defaultOptions;

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	return (
		<span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				disabled={props.disabled}
				title="Align"
				class="flex items-center justify-center rounded-sm border border-transparent p-1 transition-colors disabled:pointer-events-none disabled:opacity-40"
				classList={{
					"text-neutral-700 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-400 active:text-neutral-900 dark:text-neutral-200 dark:active:border-neutral-500 dark:active:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100":
						!checked(),
					"bg-primary-500/10 text-primary-500 hover:bg-primary-500/15 active:border-primary-500/30":
						checked(),
				}}
			>
				<Icon name={iconNameOptions[props.value]} class="size-4" />
			</button>

			<div
				ref={props.popoverRef}
				id={popoverId}
				popover="auto"
				class="mt-1 gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-xs [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
				on:toggle={onPopoverToggle}
			>
				<For each={options()}>
					{(option) => (
						<button
							type="button"
							commandfor={popoverId}
							command="hide-popover"
							title={labelOptions[option]}
							class="rounded-sm border border-transparent p-1 transition-colors"
							classList={{
								"text-neutral-700 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-400 active:text-neutral-900 dark:text-neutral-200 dark:active:border-neutral-500 dark:active:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100":
									option !== props.value,
								"bg-primary-500/10 text-primary-500 hover:bg-primary-500/15 active:border-primary-500/30":
									option === props.value,
							}}
							on:click={() => props.onChange(option)}
						>
							<Icon name={iconNameOptions[option]} class="size-4" />
						</button>
					)}
				</For>
			</div>
		</span>
	);
};
