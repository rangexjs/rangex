import { Mention } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import {
	type CaretItemFn,
	CaretMenu,
	filterCaretMenuItems,
} from "../../_Utilities";
import { mentionItems } from "./MentionItems";

export const MentionCaretMenu = () => {
	const editor = useEditorContext();
	const { mention } = editor;

	if (!mention) {
		throw new Error("Mention can't be undefined.");
	}

	const $mention = Mention(mention);

	const filteredItems = createMemo(() =>
		filterCaretMenuItems({
			items: mentionItems,
			query: $mention.query(),
			getKeys: (item) => [item.name, item.username],
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
					onClick={() => mention.select(item)}
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
		});

	const onSelect = (index: number) => {
		const item = filteredItems().at(index);

		if (!item) {
			return;
		}

		mention.select(item);
	};

	return (
		<CaretMenu
			caretMenuPort={mention.caretMenu}
			items={items}
			onSelect={onSelect}
			class="min-w-48 max-w-64"
		/>
	);
};
