import { createSignal, mapArray, onCleanup, onMount } from "solid-js";
import type {
	MentionItems,
	MentionSuggestionItem,
	MentionUIPort,
} from "#adapters";
import { type CaretItemFn, CaretMenu } from "../../../_Utilities";

interface MentionSuggestionsProps {
	uiPort: MentionUIPort;
}

export const MentionSuggestions = (props: MentionSuggestionsProps) => {
	const uiPort = props.uiPort;

	const [filteredItems, setFilteredItems] = createSignal<MentionItems>(
		uiPort.filteredItems,
	);
	const [isOpen, setIsOpen] = createSignal(uiPort.isOpen);

	onMount(() => {
		const unsubscribeFilteredItems = uiPort.onFilteredItemsUpdate((value) =>
			setFilteredItems(value),
		);
		const unsubscribeIsOpen = uiPort.onIsOpenUpdate(setIsOpen);

		onCleanup(() => {
			unsubscribeFilteredItems();
			unsubscribeIsOpen();
		});
	});

	const onSelect = (index: number) => {
		const item = filteredItems().at(index);

		if (!item) {
			console.warn("Item wasn't found.");
			return;
		}

		uiPort.emitSelect(item);
	};

	const items = mapArray<MentionSuggestionItem, CaretItemFn>(
		filteredItems,
		(item) => {
			return (params) => (
				<button
					type="button"
					class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left active:bg-neutral-200 active:dark:bg-neutral-700"
					classList={{
						"bg-neutral-100 dark:bg-neutral-800": params.isActive(),
					}}
					onClick={() => onSelect(params.index())}
				>
					<img
						src={item.img}
						alt={item.name}
						class="size-7 shrink-0 rounded-full object-cover"
					/>
					<div class="min-w-0 flex-1">
						<div class="truncate font-semibold text-neutral-800 text-sm dark:text-neutral-100">
							{item.name}
						</div>
						<div class="truncate text-neutral-500 text-xs dark:text-neutral-400">
							@{item.username}
						</div>
					</div>
				</button>
			);
		},
	);

	return (
		<CaretMenu
			ref={(element) => uiPort.anchoredOverlay.setElement(element)}
			isOpen={isOpen}
			onSelect={onSelect}
			items={items}
			class="min-w-48 max-w-64"
		/>
	);
};
