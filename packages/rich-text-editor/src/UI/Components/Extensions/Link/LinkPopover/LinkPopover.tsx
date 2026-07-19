import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import type { LinkAdapter, LinkUpdateViewFn } from "#adapters";
import { LinkEdit } from "./LinkEdit";
import { LinkPreview } from "./LinkPreview";

interface LinkPopoverProps {
	adapter: LinkAdapter;
}

export const LinkPopover = (props: LinkPopoverProps) => {
	const adapter = props.adapter;

	const [view, setView] = createSignal(adapter.view);

	onMount(() => {
		const callback: LinkUpdateViewFn = (state) => setView(state);
		adapter.subscribe({ type: "view", callback });
		onCleanup(() => adapter.unsubscribe({ type: "view", callback }));
	});

	return (
		<div
			ref={(el) => adapter.setPopover(el)}
			popover="auto"
			class="w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<span class="absolute -top-2 left-1/2 inline-block size-4 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
			<Switch>
				<Match when={view() === "preview"}>
					<LinkPreview adapter={adapter} />
				</Match>
				<Match when={view() === "edit"}>
					<LinkEdit adapter={adapter} />
				</Match>
			</Switch>
		</div>
	);
};
