import { Mention } from "@rangex/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import {
	type MentionItem,
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
		() => $mention.caretMenu.query(),
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

	// Every row gets the image circle once any item has an image, so the names stay aligned
	const hasAnyImage = createMemo(() =>
		loadedItems().some((item) => !!item.img),
	);

	const getDisplayName = (item: MentionItem) => item.displayName || item.userId;

	const selectItem = (item: MentionItem) => {
		mention.select({
			userId: item.userId,
			displayName: getDisplayName(item),
		});
	};

	const items = () =>
		loadedItems().map((item): CaretItemFn => {
			return ({ isActive }) => {
				const [hasImageError, setHasImageError] = createSignal(false);

				return (
					<button
						type="button"
						class={[
							"flex w-full items-center gap-2 rounded-sm border border-transparent p-1 text-left active:border-neutral-200 active:bg-neutral-100 active:dark:border-neutral-700 active:dark:bg-neutral-800",
							{ "bg-neutral-100 dark:bg-neutral-800": isActive() },
						]}
						onClick={() => selectItem(item)}
					>
						<span
							hidden={!hasAnyImage()}
							class="size-7 shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
						>
							<img
								hidden={!item.img || hasImageError()}
								src={item.img}
								alt=""
								class="size-full object-cover"
								onError={() => setHasImageError(true)}
							/>
						</span>
						<span
							class={[
								"min-w-0 flex-1 truncate font-medium text-sm active:text-neutral-800 active:dark:text-neutral-50",
								{ "text-neutral-600 dark:text-neutral-200": !isActive() },
								{ "text-neutral-800 dark:text-neutral-50": isActive() },
							]}
						>
							{getDisplayName(item)}
						</span>
					</button>
				);
			};
		});

	const onSelect = (index: number) => {
		const item = loadedItems().at(index);

		if (!item) {
			return;
		}

		selectItem(item);
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
