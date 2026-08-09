import { createSignal, mapArray, onCleanup, onMount } from "solid-js";
import type {
	TemplateVariableSuggestionItem,
	TemplateVariableSuggestionItems,
	TemplateVariableUIPort,
} from "#adapters";
import { type CaretItemFn, CaretMenu } from "../../../_Utilities";

interface TemplateVariableSuggestionsProps {
	uiPort: TemplateVariableUIPort;
}

export const TemplateVariableSuggestions = (
	props: TemplateVariableSuggestionsProps,
) => {
	const uiPort = props.uiPort;

	const [filteredItems, setFilteredItems] =
		createSignal<TemplateVariableSuggestionItems>(uiPort.filteredItems);
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

	const items = mapArray<TemplateVariableSuggestionItem, CaretItemFn>(
		filteredItems,
		(item) => {
			return (params) => (
				<button
					type="button"
					class="flex w-full items-center rounded-sm px-2 py-1.5 text-left font-mono text-sm active:bg-neutral-200 active:dark:bg-neutral-700"
					classList={{
						"bg-neutral-100 dark:bg-neutral-800": params.isActive(),
					}}
					onClick={() => onSelect(params.index())}
				>
					{item.label}
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
			class="min-w-40 max-w-56"
		/>
	);
};
