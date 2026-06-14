import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";
import type { LinkUpdateViewFn } from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";
import { LinkEdit } from "./LinkEdit";
import { LinkPreview } from "./LinkPreview";

export const LinkPopover = () => {
	const { linkPopoverController } = usePopoverControllersContext();

	const [view, setView] = createSignal(linkPopoverController.view);

	onMount(() => {
		const callback: LinkUpdateViewFn = (state) => setView(state);
		linkPopoverController.subscribe({ type: "view", callback });
		onCleanup(() =>
			linkPopoverController.unsubscribe({ type: "view", callback }),
		);
	});

	return (
		<div
			ref={(el) => linkPopoverController.setPopover(el)}
			popover="auto"
			class="w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md"
		>
			<span class="absolute -top-2 left-1/2 inline-block size-4 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white" />
			<Switch>
				<Match when={view() === "preview"}>
					<LinkPreview linkPopoverController={linkPopoverController} />
				</Match>
				<Match when={view() === "edit"}>
					<LinkEdit linkPopoverController={linkPopoverController} />
				</Match>
			</Switch>
		</div>
	);
};
