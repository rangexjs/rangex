import type { JSX } from "@solidjs/web";
import { Icon } from "#ui";
import { serializeURL } from "../Utilities";

interface LinkPreviewProps {
	url: string;
	onEdit: () => void;
	onCopy: () => void;
	onUnwrap: () => void;
	class?: JSX.ClassValue;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	return (
		<div class={["flex justify-between gap-2", props.class]}>
			<a
				href={serializeURL(props.url)}
				target="_blank"
				rel="noopener"
				class="self-center truncate font-semibold text-blue-600 text-sm dark:text-blue-400"
			>
				{props.url}
			</a>
			<div class="space-x-2 justify-self-end whitespace-nowrap">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					onClick={props.onEdit}
				>
					<Icon name="NotePencil" title="Edit link" class="size-4" />
				</button>
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					onClick={props.onCopy}
				>
					<Icon name="CopySimple" title="Copy link" class="size-4" />
				</button>
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					onClick={props.onUnwrap}
				>
					<Icon name="Trash" title="Remove link" class="size-4" />
				</button>
			</div>
		</div>
	);
};
