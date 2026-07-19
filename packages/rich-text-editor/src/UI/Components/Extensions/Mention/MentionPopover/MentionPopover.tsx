import {
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
} from "solid-js";
import type {
	MentionItems,
	MentionSuggestionItem,
	MentionUIPort,
	MentionUpdateFilteredItemsFn,
} from "#adapters";

interface MentionItemProps {
	popoverId: string;
	item: MentionSuggestionItem;
	onSelect: () => void;
}

const MentionItem = (props: MentionItemProps) => {
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
				<img
					src={props.item.img}
					alt={props.item.name}
					class="size-7 shrink-0 rounded-full object-cover"
				/>
				<div class="min-w-0 flex-1">
					<div class="truncate font-semibold text-neutral-800 text-sm dark:text-neutral-100">
						{props.item.name}
					</div>
					<div class="truncate text-neutral-500 text-xs dark:text-neutral-400">
						@{props.item.username}
					</div>
				</div>
			</button>
		</li>
	);
};

interface MentionPopoverProps {
	uiPort: MentionUIPort;
}

export const MentionPopover = (props: MentionPopoverProps) => {
	const uiPort = props.uiPort;

	const [filteredItems, setFilteredItems] = createSignal<MentionItems>(
		uiPort.filteredItems,
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
		const callback: MentionUpdateFilteredItemsFn = (value) =>
			setFilteredItems(value);
		uiPort.subscribe({ type: "filteredItems", callback });
		document.addEventListener("keydown", onKeyDown, { capture: true });

		onCleanup(() => {
			uiPort.unsubscribe({ type: "filteredItems", callback });
			document.removeEventListener("keydown", onKeyDown, { capture: true });
		});
	});

	return (
		<div
			ref={(el) => {
				popoverEl = el;
				uiPort.setPopover(el);
			}}
			id={popoverId}
			popover="manual"
			class="scrollbar-thin max-h-[min(100%,360px)] min-w-48 max-w-64 rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={filteredItems()}>
					{(item) => (
						<MentionItem
							popoverId={popoverId}
							item={item}
							onSelect={() => uiPort.emitSelect(item)}
						/>
					)}
				</For>
			</ul>
		</div>
	);
};
