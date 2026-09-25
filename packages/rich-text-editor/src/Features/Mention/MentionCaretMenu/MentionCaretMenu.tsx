import { Mention } from "@rangex/solid";
import { createEffect, createSignal } from "solid-js";
import {
	type MentionItems,
	useEditorContext,
	useUIOptionsContext,
} from "#context";
import { type CaretItemFn, CaretMenu } from "../../_Utilities";

export const MentionCaretMenu = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();
	const { mention } = editor;
	const mentionOptions = uiOptions.mention;

	if (!mention) {
		throw new Error("Mention can't be undefined.");
	}

	if (!mentionOptions) {
		throw new Error("MentionOptions can't be undefined.");
	}

	const $mention = Mention(mention);

	const [loadedItems, setLoadedItems] = createSignal<MentionItems>([]);

	const loadItems = async (query: string, signal: AbortSignal) => {
		try {
			const items = await mentionOptions.getItems({ query, signal });

			if (signal.aborted) {
				return;
			}

			setLoadedItems(items);
		} catch (error) {
			if (signal.aborted) {
				return;
			}

			console.error(error);
		}
	};

	// Keeps the previous items until the new ones arrive; the cleanup aborts the request once the query changes again
	createEffect(
		() => $mention.query(),
		(query) => {
			if (query === null) {
				setLoadedItems([]);
				return;
			}

			const abortController = new AbortController();

			loadItems(query, abortController.signal);

			return () => {
				abortController.abort();
			};
		},
	);

	const items = () =>
		loadedItems().map((item): CaretItemFn => {
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
		const item = loadedItems().at(index);

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
