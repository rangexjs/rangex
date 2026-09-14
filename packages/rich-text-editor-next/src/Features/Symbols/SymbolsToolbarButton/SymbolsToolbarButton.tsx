import { ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId, For } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const SymbolsToolbarButton = () => {
	const { symbols, readOnly } = useEditorContext();

	if (!symbols) {
		throw new Error("Symbols can't be undefined.");
	}

	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onToggle = (event: ToggleEvent) => {
		setChecked(event.newState === "open");
	};

	const onSymbolClick = (data: string) => {
		symbols.insert(data);
	};

	const disabled = createMemo(() => !!$readOnly?.checked());

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Smiley" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				popover="auto"
				onToggle={onToggle}
				class="scrollbar-thin mt-1 max-h-52 rounded-md border border-neutral-100 bg-white p-1 shadow-md [position-area:bottom_center] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<div>
					<div class="inline-grid grid-cols-[repeat(8,min-content)] gap-1">
						<For each={symbols.items}>
							{(item) => (
								<button
									type="button"
									class="rounded-xs border border-transparent text-lg transition-colors hover:bg-neutral-100 active:border-neutral-200 dark:active:border-neutral-700 dark:hover:bg-neutral-800"
									popovertarget={popoverId}
									popovertargetaction="hide"
									onClick={() => onSymbolClick(item)}
								>
									{item}
								</button>
							)}
						</For>
					</div>
				</div>
			</div>
		</span>
	);
};
