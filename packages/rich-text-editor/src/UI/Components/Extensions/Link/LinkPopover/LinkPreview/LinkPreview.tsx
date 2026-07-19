import { createSignal, onCleanup, onMount } from "solid-js";
import type { LinkAdapter, LinkUpdateURLFn } from "#adapters";
import { Icon } from "../../../../Icon";
import { serializeURL } from "../_Utilities";

interface LinkPreviewProps {
	adapter: LinkAdapter;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	const adapter = props.adapter;

	const [url, setUrl] = createSignal(adapter.url.inputValue);

	onMount(() => {
		const callback: LinkUpdateURLFn = (state) => setUrl(state.inputValue);
		adapter.subscribe({ type: "url", callback });
		onCleanup(() => adapter.unsubscribe({ type: "url", callback }));
	});

	const onEdit = () => {
		adapter.updateState({ view: "edit" });
		adapter.emitViewChange();
	};

	const onUnwrap = () => {
		adapter.emitUnwrap();
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
					on:click={onUnwrap}
				>
					<Icon name="Trash" class="size-4" />
				</button>
			</div>
		</div>
	);
};
