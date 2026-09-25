import { Emoji } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import {
	type CaretItemFn,
	CaretMenu,
	filterCaretMenuItems,
} from "../../_Utilities";

const MAX_RESULTS = 16;

export const EmojiCaretMenu = () => {
	const editor = useEditorContext();
	const { emoji } = editor;

	if (!emoji) {
		throw new Error("Emoji can't be undefined.");
	}

	const $emoji = Emoji(emoji);

	const filteredItems = createMemo(() =>
		filterCaretMenuItems({
			items: $emoji.items,
			query: $emoji.query(),
			getKeys: (item) => [item.name],
			limit: MAX_RESULTS,
		}),
	);

	const items = () =>
		filteredItems().map((item): CaretItemFn => {
			return ({ isActive }) => (
				<button
					type="button"
					class={[
						"flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left active:bg-neutral-200 active:dark:bg-neutral-700",
						{ "bg-neutral-100 dark:bg-neutral-800": isActive() },
					]}
					onClick={() => emoji.select(item)}
				>
					<span class="shrink-0 text-lg leading-none">{item.emoji}</span>
					<span class="truncate text-neutral-600 text-sm dark:text-neutral-300">
						:{item.name}:
					</span>
				</button>
			);
		});

	const onSelect = (index: number) => {
		const item = filteredItems().at(index);

		if (!item) {
			return;
		}

		emoji.select(item);
	};

	return (
		<CaretMenu
			caretMenuPort={emoji.caretMenu}
			items={items}
			onSelect={onSelect}
			class="min-w-40 max-w-56"
		/>
	);
};
