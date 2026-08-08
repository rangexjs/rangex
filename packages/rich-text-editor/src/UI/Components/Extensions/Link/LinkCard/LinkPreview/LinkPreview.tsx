import { createSignal, onCleanup, onMount } from "solid-js";
import type { LinkUIPort } from "#adapters";
import { Icon } from "../../../../Icon";
import { serializeURL } from "../_Utilities";

interface LinkPreviewProps {
	uiPort: LinkUIPort;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	const uiPort = props.uiPort;

	const [url, setUrl] = createSignal(uiPort.url.inputValue);
	const [view, setView] = createSignal(uiPort.view);

	onMount(() => {
		const unsubscribeUrl = uiPort.onUrlUpdate((state) =>
			setUrl(state.inputValue),
		);
		const unsubscribeView = uiPort.onViewUpdate((state) => setView(state));

		onCleanup(() => {
			unsubscribeUrl();
			unsubscribeView();
		});
	});

	const onEdit = () => {
		uiPort.emitViewChange("edit");
	};

	const onUnwrap = () => {
		uiPort.emitUnwrap();
	};

	return (
		<div
			class="flex justify-between gap-2"
			classList={{ hidden: view() !== "preview" }}
		>
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
					<Icon name="Export" class="size-4" />
				</button>
			</div>
		</div>
	);
};
