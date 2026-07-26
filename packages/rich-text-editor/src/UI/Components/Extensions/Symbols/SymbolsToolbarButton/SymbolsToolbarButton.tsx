import {
	createMemo,
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
} from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const SymbolsToolbarButton = () => {
	const { symbolsUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!symbolsUIPort) {
		throw new Error("SymbolsUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		symbolsUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton = symbolsUIPort.onToolbarButtonUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeToolbarButton();
			unsubscribeReadOnly?.();
		});
	});

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const onSymbolClick = (data: string) => {
		symbolsUIPort.emitInsertRequest({ data });
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

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
				on:toggle={onPopoverToggle}
				class="scrollbar-thin mt-1 max-h-52 rounded-md border border-neutral-100 bg-white p-1 shadow-md [position-area:bottom_center] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<div>
					<div class="inline-grid grid-cols-[repeat(8,min-content)] gap-1">
						<For each={symbolsUIPort.items}>
							{(item) => (
								<button
									type="button"
									class="rounded-xs border border-transparent text-lg transition-colors hover:bg-neutral-100 active:border-neutral-200 dark:active:border-neutral-700 dark:hover:bg-neutral-800"
									popovertarget={popoverId}
									popovertargetaction="hide"
									on:click={() => onSymbolClick(item)}
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
