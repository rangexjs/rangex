import { createSignal, createUniqueId, For } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";
import { emojis } from "./Emojis";

export const SymbolsToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { symbols } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(symbols.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.symbols,
		callback: (state) => setDisabled(state.disabled),
	});

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const onEmojiClick = (data: string) => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.symbols,
			data,
		});
	};

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
				class="mt-1 max-h-52 rounded-md border border-neutral-100 p-1 shadow-md [position-area:bottom_center] [scrollbar-width:thin]"
			>
				<div>
					<div class="inline-grid grid-cols-[repeat(8,min-content)] gap-1">
						<For each={emojis}>
							{(emoji) => (
								<button
									type="button"
									class="rounded-xs border border-transparent text-lg transition-colors hover:bg-neutral-100 active:border-neutral-200"
									popovertarget={popoverId}
									popovertargetaction="hide"
									on:click={() => onEmojiClick(emoji)}
								>
									{emoji}
								</button>
							)}
						</For>
					</div>
				</div>
			</div>
		</span>
	);
};
