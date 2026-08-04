import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import type { LinkUIPort } from "#adapters";
import { LinkEdit } from "./LinkEdit";
import { LinkPreview } from "./LinkPreview";

interface LinkCardProps {
	uiPort: LinkUIPort;
}

export const LinkCard = (props: LinkCardProps) => {
	const uiPort = props.uiPort;

	const [view, setView] = createSignal(uiPort.view);

	onMount(() => {
		const unsubscribeView = uiPort.onViewUpdate((state) => setView(state));
		onCleanup(() => {
			unsubscribeView();
		});
	});

	return (
		<div
			ref={(el) => uiPort.anchoredOverlay.setElement(el)}
			class="z-20 w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<span class="absolute -top-2 left-1/2 inline-block size-4 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
			<Switch>
				<Match when={view() === "preview"}>
					<LinkPreview uiPort={uiPort} />
				</Match>
				<Match when={view() === "edit"}>
					<LinkEdit uiPort={uiPort} />
				</Match>
			</Switch>
		</div>
	);
};
