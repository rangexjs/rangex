import { createSignal, onCleanup, onMount } from "solid-js";
import type { LinkUIPort, LinkUpdateURLFn } from "#adapters";
import { Icon } from "../../../../Icon";
import { serializeURL } from "../_Utilities";

interface LinkPreviewProps {
	uiPort: LinkUIPort;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	const uiPort = props.uiPort;

	const [url, setUrl] = createSignal(uiPort.url.inputValue);

	onMount(() => {
		const callback: LinkUpdateURLFn = (state) => setUrl(state.inputValue);
		uiPort.subscribe({ type: "url", callback });
		onCleanup(() => uiPort.unsubscribe({ type: "url", callback }));
	});

	const onEdit = () => {
		uiPort.setView("edit");
		uiPort.emitViewChange();
	};

	const onUnwrap = () => {
		uiPort.emitUnwrap();
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
