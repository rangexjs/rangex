import { createSignal, mapArray, onCleanup, onMount } from "solid-js";
import { type CommandMenuItemValue, commandMenuItemsLabel } from "#ports";
import { type CaretItemFn, CaretMenu } from "../_Utilities";
import { useUIPortsContext } from "../App";
import { Icon } from "../Icon";
import type { CommandMenuItemEntry } from "./BuildCommandMenuActions";
import { buildCommandMenuActions } from "./BuildCommandMenuActions";

export const CommandMenu = () => {
	const { commandMenuUIPort } = useUIPortsContext();

	if (!commandMenuUIPort) {
		return null;
	}

	const selectEntry = (entry: CommandMenuItemEntry) => {
		commandMenuUIPort.emitBeforeSelect();
		entry.action.onSelect();
	};

	const staticEntries = buildCommandMenuActions({
		items: commandMenuUIPort.items,
	});

	const computeFilteredEntries = (filteredItems: Set<CommandMenuItemValue>) =>
		staticEntries.filter((entry) => filteredItems.has(entry.name));

	const [filteredEntries, setFilteredEntries] = createSignal(
		computeFilteredEntries(commandMenuUIPort.filteredItems),
	);
	const [isOpen, setIsOpen] = createSignal(commandMenuUIPort.isOpen);

	onMount(() => {
		const unsubscribeFilteredItems = commandMenuUIPort.onFilteredItemsUpdate(
			(filteredItems) => {
				setFilteredEntries(computeFilteredEntries(filteredItems));
			},
		);

		const unsubscribeIsOpen = commandMenuUIPort.onIsOpenUpdate(setIsOpen);

		onCleanup(() => {
			unsubscribeFilteredItems();
			unsubscribeIsOpen();
		});
	});

	const onSelect = (index: number) => {
		const activeEntry = filteredEntries().at(index);

		if (!activeEntry) {
			console.warn("Entry wasn't found.");
			return;
		}

		selectEntry(activeEntry);
	};

	const items = mapArray<CommandMenuItemEntry, CaretItemFn>(
		filteredEntries,
		(entry) => {
			return (params) => (
				<button
					type="button"
					class="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-left text-sm active:bg-neutral-200 active:dark:bg-neutral-700"
					classList={{
						"bg-neutral-100 dark:bg-neutral-800": params.isActive(),
					}}
					onClick={() => onSelect(params.index())}
				>
					<Icon name={entry.action.icon} class="size-4" />
					<span>{commandMenuItemsLabel[entry.name]}</span>
				</button>
			);
		},
	);

	return (
		<CaretMenu
			ref={(element) => commandMenuUIPort.setAnchoredOverlay(element)}
			isOpen={isOpen}
			onSelect={onSelect}
			items={items}
			class="min-w-48 max-w-64"
		/>
	);
};
