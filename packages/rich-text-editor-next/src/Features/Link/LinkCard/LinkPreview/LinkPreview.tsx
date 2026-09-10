import type { ReactiveLinkPort } from "@rangex/solid";
import { Icon } from "#ui";
import { serializeURL } from "../_Utilities";

interface LinkPreviewProps {
	link: ReactiveLinkPort;
}

export const LinkPreview = (props: LinkPreviewProps) => {
	const onEdit = () => {
		props.link.viewChange("edit");
	};

	const onUnwrap = () => {
		props.link.unwrap();
	};

	return (
		<div
			class="flex justify-between gap-2"
			hidden={props.link.view() !== "preview"}
		>
			<a
				href={serializeURL(props.link.url().inputValue)}
				target="_blank"
				rel="noopener"
				class="self-center truncate font-semibold text-blue-600 text-sm dark:text-blue-400"
			>
				{props.link.url().inputValue}
			</a>
			<div class="space-x-2 justify-self-end whitespace-nowrap">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					onClick={onEdit}
				>
					<Icon name="NotePencil" class="size-4" />
				</button>
				<button
					type="button"
					class="btn-neutral-solid rounded-sm p-1"
					onClick={onUnwrap}
				>
					<Icon name="Export" class="size-4" />
				</button>
			</div>
		</div>
	);
};
