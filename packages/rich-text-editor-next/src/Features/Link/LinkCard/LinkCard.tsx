import { Portal } from "@solidjs/web";
import { useReactiveEditorContext } from "#context";
import { LinkEdit } from "./LinkEdit";
import { LinkPreview } from "./LinkPreview";

export const LinkCard = () => {
	const { link } = useReactiveEditorContext();

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	link.overlayEl.classList.add("overflow-visible");

	return (
		<Portal mount={link.overlayEl}>
			<div class="z-20 w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900">
				<span class="absolute -top-1.5 left-1/2 inline-block size-3 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
				<LinkPreview link={link} />
				<LinkEdit link={link} />
			</div>
		</Portal>
	);
};
