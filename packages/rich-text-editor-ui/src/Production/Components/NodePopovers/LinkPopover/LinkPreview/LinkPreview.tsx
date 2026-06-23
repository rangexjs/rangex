import { createSignal, onCleanup, onMount } from "solid-js";
import type {
	LinkPopoverController,
	LinkUpdateURLFn,
} from "../../../.././PopoverControllers";
import { Icon } from "../../../Icon";
import { serializeURL } from "../_Utilities";

interface LinkPreviewProps {
	linkPopoverController: LinkPopoverController;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	const [url, setUrl] = createSignal(
		props.linkPopoverController.url.inputValue,
	);

	onMount(() => {
		const callback: LinkUpdateURLFn = (state) => setUrl(state.inputValue);
		props.linkPopoverController.subscribe({ type: "url", callback });
		onCleanup(() =>
			props.linkPopoverController.unsubscribe({ type: "url", callback }),
		);
	});

	const onEdit = () => {
		props.linkPopoverController.updateState({ view: "edit" });
		props.linkPopoverController.emitViewChange();
	};

	const onRemove = () => {
		props.linkPopoverController.emitRemove();
	};

	return (
		<div class="flex justify-between gap-2">
			<a
				href={serializeURL(url())}
				target="_blank"
				rel="noopener"
				class="self-center truncate font-semibold text-blue-600 text-sm dark:text-blue-400"
			>
				{url()}
			</a>
			<div class="space-x-2 justify-self-end whitespace-nowrap">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					on:click={onEdit}
				>
					<Icon name="NotePencil" class="size-4" />
				</button>
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					on:click={onRemove}
				>
					<Icon name="Trash" class="size-4" />
				</button>
			</div>
		</div>
	);
};
