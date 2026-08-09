import {
	type Accessor,
	createEffect,
	createSelector,
	createSignal,
	For,
	type JSXElement,
	on,
	onCleanup,
	onMount,
} from "solid-js";

interface CaretItemParams {
	index: Accessor<number>;
	isActive: Accessor<boolean>;
}

export type CaretItemFn = (params: CaretItemParams) => JSXElement;

export interface CaretMenuProps {
	ref: (element: HTMLDivElement) => void;
	items: Accessor<CaretItemFn[]>;
	isOpen: Accessor<boolean>;
	onSelect: (index: number) => void;
	class?: string;
}

export const CaretMenu = (props: CaretMenuProps) => {
	const [activeIndex, setActiveIndex] = createSignal(0);
	const isEntryActive = createSelector(activeIndex);

	let container: HTMLDivElement | undefined;
	let listEl: HTMLUListElement | undefined;

	const resetList = () => {
		if (!container) {
			throw new Error("Container can't be undefined.");
		}

		setActiveIndex(0);
		container.scrollTo({ top: 0 });
	};

	createEffect(
		on(props.items, () => {
			resetList();
		}),
	);

	createEffect(
		on(props.isOpen, (open) => {
			if (open) {
				resetList();
			}
		}),
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

	onMount(() => {
		document.addEventListener("keydown", onKeyDown, { capture: true });

		onCleanup(() => {
			document.removeEventListener("keydown", onKeyDown, { capture: true });
		});
	});

	return (
		<div
			ref={(element) => {
				container = element;
				props.ref(element);
			}}
			class="scrollbar-thin z-20 max-h-[min(100%,360px)] overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900"
			classList={{ [props.class ?? ""]: true }}
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={props.items()}>
					{(item, index) => {
						const isActive = () => isEntryActive(index());
						return (
							<li
								class="scroll-my-1"
								on:pointerdown={(event) => event.preventDefault()}
								on:pointermove={() => setActiveIndex(index())}
							>
								{item({ index, isActive })}
							</li>
						);
					}}
				</For>
			</ul>
		</div>
	);
};
