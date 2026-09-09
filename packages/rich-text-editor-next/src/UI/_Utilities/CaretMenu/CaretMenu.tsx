import type { JSX } from "@solidjs/web";
import { Portal } from "@solidjs/web";
import {
	type Accessor,
	createEffect,
	createSignal,
	For,
	onSettled,
} from "solid-js";

interface CaretItemParams {
	index: Accessor<number>;
	isActive: Accessor<boolean>;
}

export type CaretItemFn = (params: CaretItemParams) => JSX.Element;

export interface CaretMenuProps {
	caretMenuEl: HTMLDivElement;
	items: Accessor<CaretItemFn[]>;
	isOpen: Accessor<boolean>;
	onSelect: (index: number) => void;
	class?: string;
}

export const CaretMenu = (props: CaretMenuProps) => {
	props.caretMenuEl.classList.add(
		"scrollbar-thin",
		"z-20",
		"overflow-y-auto",
		"max-h-[min(100%,360px)]",
		"rounded-lg",
		"border",
		"border-neutral-300",
		"bg-white",
		"shadow-md",
		"dark:border-neutral-700",
		"dark:bg-neutral-900",
	);

	if (props.class) {
		props.caretMenuEl.classList.add(...props.class.split(" ").filter(Boolean));
	}

	const [activeIndex, setActiveIndex] = createSignal(0);
	const isEntryActive = (index: number) => activeIndex() === index;

	let listEl: HTMLUListElement | undefined;

	const resetList = () => {
		setActiveIndex(0);
		props.caretMenuEl.scrollTo({ top: 0 });
	};

	createEffect(
		() => props.items(),
		() => {
			resetList();
		},
	);

	createEffect(
		() => props.isOpen(),
		(open) => {
			if (open) {
				resetList();
			}
		},
	);

	const onKeyDown = (event: KeyboardEvent) => {
		if (!listEl) {
			throw new Error("List can't be undefined.");
		}

		if (!props.isOpen()) {
			return;
		}

		if (
			event.key !== "ArrowUp" &&
			event.key !== "ArrowDown" &&
			event.key !== "Enter" &&
			event.key !== "Tab"
		) {
			return;
		}

		const items = props.items();

		if (!items.length) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		if (event.key === "Enter" || event.key === "Tab") {
			props.onSelect(activeIndex());
			return;
		}

		const delta = { ArrowUp: -1, ArrowDown: 1 }[event.key];
		const nextIndex = (activeIndex() + delta + items.length) % items.length;

		setActiveIndex(nextIndex);

		const activeListItem = [...listEl.children].at(nextIndex);

		if (!activeListItem) {
			console.warn("ActiveListItem wasn't found.");
			return;
		}

		activeListItem.scrollIntoView({ block: "nearest" });
	};

	onSettled(() => {
		document.addEventListener("keydown", onKeyDown, { capture: true });

		return () => {
			document.removeEventListener("keydown", onKeyDown, { capture: true });
		};
	});

	return (
		<Portal mount={props.caretMenuEl}>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={props.items()}>
					{(item, index) => {
						const isActive = () => isEntryActive(index());
						return (
							<li
								class="scroll-my-1"
								onPointerDown={(event) => event.preventDefault()}
								onPointerMove={() => setActiveIndex(index())}
							>
								{item({ index, isActive })}
							</li>
						);
					}}
				</For>
			</ul>
		</Portal>
	);
};
