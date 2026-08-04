import { createSignal, For, onCleanup, onMount } from "solid-js";
import type { EmojiItems, EmojiSuggestionItem, EmojiUIPort } from "#adapters";

interface EmojiItemProps {
	item: EmojiSuggestionItem;
	onSelect: () => void;
}

const EmojiItem = (props: EmojiItemProps) => {
	return (
		<li>
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-neutral-100 hover:transition-colors focus:bg-neutral-100 active:bg-neutral-200 dark:active:bg-neutral-700 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800"
				on:pointerdown={(event) => event.preventDefault()}
				on:click={props.onSelect}
			>
				<span class="shrink-0 text-lg leading-none">{props.item.emoji}</span>
				<span class="truncate text-neutral-600 text-sm dark:text-neutral-300">
					:{props.item.name}:
				</span>
			</button>
		</li>
	);
};

interface EmojiPopoverProps {
	uiPort: EmojiUIPort;
}

export const EmojiPopover = (props: EmojiPopoverProps) => {
	const uiPort = props.uiPort;

	const [filteredItems, setFilteredItems] = createSignal<EmojiItems>(
		uiPort.filteredItems,
	);
	const [isOpen, setIsOpen] = createSignal(uiPort.isOpen);

	let anchoredEl: HTMLDivElement | undefined;
	let listEl: HTMLUListElement | undefined;

	const getNeighborButton = (
		activeButton: Element | null,
		direction: "ArrowUp" | "ArrowDown",
	) => {
		if (!listEl) {
			throw new Error("List can't be undefined.");
		}

		const buttons = [...listEl.querySelectorAll("button")];

		if (activeButton instanceof HTMLButtonElement) {
			const currentIndex = buttons.indexOf(activeButton);

			const previousIndex =
				(currentIndex - 1 + buttons.length) % buttons.length;
			const nextIndex = (currentIndex + 1) % buttons.length;

			const siblingIndex = { ArrowUp: previousIndex, ArrowDown: nextIndex }[
				direction
			];

			const siblingButton = buttons.at(siblingIndex);

			if (!siblingButton) {
				throw new Error("Button wasn't found.");
			}

			return siblingButton;
		}

		const button = listEl.querySelector("button");

		if (!button) {
			throw new Error("Button wasn't found.");
		}

		return button;
	};

	// We should refactor once it has full browser support (+2yrs support on safari)
	// https://open-ui.org/components/beforefocus.explainer/
	const onKeyDown = (event: KeyboardEvent) => {
		if (!anchoredEl) {
			throw new Error("AnchorElement not supposed to be undefined.");
		}

		if (!isOpen()) {
			return;
		}

		if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
			return;
		}

		if (!listEl) {
			throw new Error("List not supposed to be undefined.");
		}

		event.preventDefault();
		event.stopPropagation();

		const shadowRoot = anchoredEl.getRootNode();

		if (!(shadowRoot instanceof ShadowRoot)) {
			throw new Error("PopoverEl supposed to be inside a ShadowRoot.");
		}

		const { activeElement } = shadowRoot;

		const neighborButton = getNeighborButton(activeElement, event.key);

		neighborButton.focus({ focusVisible: false, preventScroll: true });
		neighborButton.scrollIntoView({ block: "nearest" });
	};

	onMount(() => {
		const unsubscribeFilteredItems = uiPort.onFilteredItemsUpdate((value) =>
			setFilteredItems(value),
		);
		const unsubscribeIsOpen = uiPort.onIsOpenUpdate(setIsOpen);
		document.addEventListener("keydown", onKeyDown, { capture: true });

		onCleanup(() => {
			unsubscribeFilteredItems();
			unsubscribeIsOpen();
			document.removeEventListener("keydown", onKeyDown, { capture: true });
		});
	});

	return (
		<div
			ref={(el) => {
				anchoredEl = el;
				uiPort.anchoredOverlay.setElement(el);
			}}
			class="scrollbar-thin z-20 max-h-[min(100%,300px)] min-w-40 max-w-56 overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={filteredItems()}>
					{(item) => (
						<EmojiItem item={item} onSelect={() => uiPort.emitSelect(item)} />
					)}
				</For>
			</ul>
		</div>
	);
};
