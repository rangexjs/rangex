import type { CaretMenuPublicPort } from "@rangex/editor";
import { FloatingPortal } from "@rangex/solid";
import type { JSX } from "@solidjs/web";
import { type Accessor, createEffect, createSignal, For, onCleanup, onSettled } from "solid-js";

interface CaretItemParams {
	index: Accessor<number>;
	isActive: Accessor<boolean>;
}

export type CaretItemFn = (params: CaretItemParams) => JSX.Element;

export interface CaretMenuProps {
	caretMenuPort: CaretMenuPublicPort;
	items: Accessor<CaretItemFn[]>;
	onSelect: (index: number) => void;
	class?: JSX.ClassValue;
}

export const CaretMenu = (props: CaretMenuProps) => {
	const [activeIndex, setActiveIndex] = createSignal(0);
	const isEntryActive = (index: number) => activeIndex() === index;

	let listEl: HTMLUListElement | undefined;

	const resetList = () => {
		setActiveIndex(0);
		props.caretMenuPort.element.scrollTo({ top: 0 });
	};

	createEffect(
		() => props.items(),
		() => {
			resetList();
		},
	);

	const queryUpdateCleanup = props.caretMenuPort.onQueryUpdate(() => {
		resetList();
	});

	onCleanup(() => {
		queryUpdateCleanup();
	});

	const onKeyDown = (event: KeyboardEvent) => {
		if (!listEl) {
			throw new Error("List can't be undefined.");
		}

		if (props.caretMenuPort.query === null) {
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
		<FloatingPortal
			mount={props.caretMenuPort.element}
			class={[
				"scrollbar-thin z-20 max-h-[min(100%,360px)] overflow-y-auto rounded-lg border border-neutral-300 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900",
				props.class,
				{ hidden: !props.items().length },
			]}
		>
			<ul ref={listEl} class="flex flex-col gap-0.5 p-1">
				<For each={props.items()}>
					{(item, index) => {
						const isActive = () => isEntryActive(index());
						return (
							<li
								class="scroll-my-0.5"
								onPointerDown={(event) => event.preventDefault()}
								onPointerMove={() => setActiveIndex(index())}
							>
								{item({ index, isActive })}
							</li>
						);
					}}
				</For>
			</ul>
		</FloatingPortal>
	);
};
