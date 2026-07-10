import { createSignal, onCleanup, onMount } from "solid-js";
import type { UpdateAlignFn } from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";
import { Icon } from "../../Icon";
import { BlockAlign } from "../_Utilities";

/**
 * Swap, edit, and delete are visual only for now — real actions will be wired up
 * once the rest of the image popover's feature set is decided.
 */
export const ImagePopover = () => {
	const { imagePopoverController: controller } = usePopoverControllersContext();

	const [align, setAlign] = createSignal(controller.align);

	let blockAlignPopover: HTMLDivElement | undefined;

	onMount(() => {
		const onAlign: UpdateAlignFn = (value) => setAlign(value);

		controller.subscribe({ type: "align", callback: onAlign });

		onCleanup(() => {
			controller.unsubscribe({ type: "align", callback: onAlign });
		});
	});

	const onBeforeToggle = () => {
		if (!blockAlignPopover) {
			throw new Error("BlockAlignPopover shouldn't be undefined.");
		}

		if (blockAlignPopover.matches(":popover-open")) {
			blockAlignPopover.hidePopover();
		}
	};

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			popover="manual"
			class="items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs open:flex dark:border-neutral-700 dark:bg-neutral-900"
			on:beforetoggle={onBeforeToggle}
		>
			<BlockAlign
				value={align()}
				onChange={(value) => controller.emitAlignChange(value)}
				popoverRef={(el) => {
					blockAlignPopover = el;
				}}
			/>

			<button
				type="button"
				class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
				title="Swap"
			>
				<Icon name="Swap" class="size-4" />
			</button>

			<button
				type="button"
				class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
				title="Edit"
			>
				<Icon name="NotePencil" class="size-4" />
			</button>

			<button
				type="button"
				class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
				title="Delete"
			>
				<Icon name="Trash" class="size-4" />
			</button>
		</div>
	);
};
