import { createSignal, For, onCleanup, onMount } from "solid-js";
import type { CommandMenuUIPort } from "#adapters";
import { type CommandMenuItemValue, commandMenuItemsLabel } from "#ports";
import { useUIPortsContext } from "../App";
import { Icon } from "../Icon";
import type { CommandMenuItemEntry } from "./BuildCommandMenuActions";
import { buildCommandMenuActions } from "./BuildCommandMenuActions";

interface CommandMenuItemProps {
	entry: CommandMenuItemEntry;
	commandMenuUIPort: CommandMenuUIPort;
}

const CommandMenuItem = (props: CommandMenuItemProps) => {
	const onSelect = () => {
		props.commandMenuUIPort.emitBeforeSelect();
		props.entry.action.onSelect();
	};

	return (
		<li>
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-left text-sm hover:bg-neutral-100 hover:transition-colors focus:bg-neutral-100 active:bg-neutral-200 dark:active:bg-neutral-700 dark:focus:bg-neutral-800 dark:hover:bg-neutral-800"
				on:pointerdown={(event) => event.preventDefault()}
				onClick={onSelect}
			>
				<Icon name={props.entry.action.icon} class="size-4" />
				<span>{commandMenuItemsLabel[props.entry.name]}</span>
			</button>
		</li>
	);
};

export const CommandMenu = () => {
	const { commandMenuUIPort } = useUIPortsContext();

	if (!commandMenuUIPort) {
		return null;
	}

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
			throw new Error("AnchorElement supposed to be inside a ShadowRoot.");
		}

		const { activeElement } = shadowRoot;

		const neighborButton = getNeighborButton(activeElement, event.key);

		neighborButton.focus({ focusVisible: false, preventScroll: true });
		neighborButton.scrollIntoView({ block: "nearest" });
	};

	onMount(() => {
		document.addEventListener("keydown", onKeyDown, { capture: true });

		onCleanup(() => {
			document.removeEventListener("keydown", onKeyDown, { capture: true });
		});
	});

	return (
		<div
			ref={(element) => {
				anchoredEl = element;
				commandMenuUIPort.setAnchoredOverlay(element);
			}}
			class="scrollbar-thin z-20 max-h-[min(100%,360px)] min-w-48 max-w-64 overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={filteredEntries()}>
					{(entry) => (
						<CommandMenuItem
							entry={entry}
							commandMenuUIPort={commandMenuUIPort}
						/>
					)}
				</For>
			</ul>
		</div>
	);
};
