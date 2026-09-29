import type { BlockAlignValue } from "@rangex/editor";
import { createUniqueId, For } from "solid-js";
import { Icon, type IconName } from "#ui";

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

	const options = () => props.options ?? defaultOptions;

	return (
		<span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				disabled={props.disabled}
				aria-label="Align"
				class="btn-menu-trigger flex items-center justify-center rounded-sm p-1"
			>
				<Icon name={iconNameOptions[props.value]} class="size-4" />
			</button>

			<div
				ref={props.popoverRef}
				id={popoverId}
				popover="auto"
				class="mt-1 gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-xs [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
			>
				<For each={options()}>
					{(option) => (
						<button
							type="button"
							commandfor={popoverId}
							command="hide-popover"
							aria-label={labelOptions[option]}
							class="btn-menu-item rounded-sm p-1"
							data-checked={`${option === props.value}`}
							aria-pressed={`${option === props.value}`}
							onClick={() => props.onChange(option)}
						>
							<Icon name={iconNameOptions[option]} class="size-4" />
						</button>
					)}
				</For>
			</div>
		</span>
	);
};
