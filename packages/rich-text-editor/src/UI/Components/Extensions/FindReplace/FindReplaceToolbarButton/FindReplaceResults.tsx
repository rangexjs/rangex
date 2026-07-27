import { type Accessor, createEffect, For } from "solid-js";
import type { FindReplaceSearchResult } from "#adapters";
import { Icon } from "../../../Icon";

interface FindReplaceResultsProps {
	results: Accessor<FindReplaceSearchResult[]>;
	currentIndex: Accessor<number>;
	onClick: (index: number) => void;
}

export const FindReplaceResults = (props: FindReplaceResultsProps) => {
	let listRef: HTMLOListElement | undefined;
	let detailsRef: HTMLDetailsElement | undefined;

	const scrollIntoListItem = (currentIndex: number) => {
		if (!listRef) {
			return;
		}

		const listItem = listRef.children[currentIndex];

		if (!listItem) {
			return;
		}

		listItem.scrollIntoView({ block: "center", behavior: "instant" });
	};

	createEffect(() => {
		const currentIndex = props.currentIndex();

		scrollIntoListItem(currentIndex);
	});

	const getSnippet = (
		segmentText: string,
		matchStart: number,
		matchEnd: number,
	) => {
		const maxLength = 40;
		const beforeHighlight = segmentText.slice(0, matchStart);
		const highlighted = segmentText.slice(matchStart, matchEnd);
		const afterHighlight = segmentText.slice(matchEnd);

		const remaining = Math.max(8, maxLength - highlighted.length);
		const remainingEven = remaining % 2 ? remaining + 1 : remaining;

		const remainingBefore = beforeHighlight.slice(-remainingEven);
		const remainingAfter = afterHighlight.slice(0, remainingEven);

		return {
			before: remainingBefore,
			highlighted,
			after: remainingAfter,
			leadingEllipsis: remainingBefore.length < beforeHighlight.length,
			trailingEllipsis: remainingAfter.length < afterHighlight.length,
		};
	};

	const onToggle = (event: ToggleEvent) => {
		if (event.newState !== "open") {
			return;
		}

		detailsRef?.addEventListener(
			"transitionend",
			() => scrollIntoListItem(props.currentIndex()),
			{ once: true },
		);
	};

	return (
		<details ref={detailsRef} class="group mb-3" on:toggle={onToggle}>
			<summary class="flex cursor-pointer select-none items-center gap-1 font-medium text-neutral-600 text-xs transition-colors hover:text-neutral-800 active:text-neutral-900 dark:text-neutral-300 dark:active:text-white dark:hover:text-neutral-100">
				<Icon
					name="CaretRight"
					class="size-2 transition-transform group-open:rotate-90"
				/>
				Results ({props.results().length})
			</summary>
			<ol
				ref={listRef}
				class="scrollbar-thin mt-1 max-h-72 overflow-auto overscroll-contain rounded border border-neutral-200 dark:border-neutral-700"
				classList={{ hidden: !props.results().length }}
			>
				<For each={props.results()}>
					{(result, i) => {
						const index = i();
						const snippet = getSnippet(
							result.segmentText,
							result.matchStart,
							result.matchEnd,
						);
						return (
							<li class="flex font-mono">
								<span
									class="inline-block min-w-6 shrink-0 whitespace-nowrap border-r bg-neutral-100 px-1 py-1 text-center font-bold text-xs dark:bg-neutral-800"
									classList={{
										"border-neutral-200 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400":
											props.currentIndex() !== index,
										"border-amber-600 text-amber-600":
											props.currentIndex() === index,
									}}
								>
									{index + 1}
								</span>
								<button
									type="button"
									class="w-full px-1 text-left text-xs transition-colors hover:bg-neutral-50 active:bg-neutral-100 active:text-neutral-900 dark:active:bg-neutral-700 dark:active:text-white dark:hover:bg-neutral-800"
									on:click={() => props.onClick(index)}
								>
									<span class="truncate font-mono text-neutral-600 dark:text-neutral-300">
										<span classList={{ hidden: !snippet.leadingEllipsis }}>
											…
										</span>
										<span>{snippet.before}</span>
										<mark class="bg-yellow-200 text-neutral-900 not-italic">
											{snippet.highlighted}
										</mark>
										<span>{snippet.after}</span>
										<span
											class="text-neutral-400 dark:text-neutral-500"
											classList={{ hidden: !snippet.trailingEllipsis }}
										>
											…
										</span>
									</span>
								</button>
							</li>
						);
					}}
				</For>
			</ol>
		</details>
	);
};
