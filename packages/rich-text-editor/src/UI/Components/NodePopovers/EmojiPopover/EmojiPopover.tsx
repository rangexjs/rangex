import {
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
} from "solid-js";
import type { EmojiItems, EmojiSuggestionItem } from "#ports";
import { usePopoverControllersContext } from "../../App";

interface EmojiItemProps {
	popoverId: string;
	item: EmojiSuggestionItem;
	onSelect: () => void;
}

const EmojiItem = (props: EmojiItemProps) => {
	return (
		<li>
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left hover:bg-neutral-100 hover:transition-colors focus:bg-neutral-100 active:bg-neutral-200 dark:active:bg-neutral-700 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800"
				commandfor={props.popoverId}
				command="hide-popover"
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

export const EmojiPopover = () => {
	const { emojiPopoverController: controller } = usePopoverControllersContext();

	const [filteredItems, setFilteredItems] = createSignal<EmojiItems>(
		controller.filteredItems,
	);

	const popoverId = createUniqueId();
	let popoverEl: HTMLDivElement | undefined;
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
		if (!popoverEl?.matches(":popover-open")) {
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

		const shadowRoot = popoverEl.getRootNode();

		if (!(shadowRoot instanceof ShadowRoot)) {
			throw new Error("PopoverEl supposed to be inside a ShadowRoot.");
		}

		const { activeElement } = shadowRoot;

		const neighborButton = getNeighborButton(activeElement, event.key);

		neighborButton.focus({ focusVisible: false, preventScroll: true });
		neighborButton.scrollIntoView({ block: "nearest" });
	};

	onMount(() => {
		controller.subscribe({ type: "filteredItems", callback: setFilteredItems });
		document.addEventListener("keydown", onKeyDown, { capture: true });
	});

	onCleanup(() => {
		controller.unsubscribe({
			type: "filteredItems",
			callback: setFilteredItems,
		});
		document.removeEventListener("keydown", onKeyDown, { capture: true });
	});

	return (
		<div
			ref={(el) => {
				popoverEl = el;
				controller.setPopover(el);
			}}
			id={popoverId}
			popover="manual"
			class="scrollbar-thin max-h-[min(100%,300px)] min-w-40 max-w-56 rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={filteredItems()}>
					{(item) => (
						<EmojiItem
							popoverId={popoverId}
							item={item}
							onSelect={() => controller.emitSelect(item)}
						/>
					)}
				</For>
			</ul>
		</div>
	);
};
