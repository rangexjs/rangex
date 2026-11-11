import { createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Icon } from "#ui";

const copiedFeedbackMs = 1200;

export interface MediaSourceProps {
	src: string | null;
	// The trigger's accessible name (e.g. "Image source")
	label: string;
	popoverRef?: (element: HTMLDivElement) => void;
}

/*
 * A button that opens the media's source URL in a popover: a link that opens it in a new tab, and a button that copies
 * it. A relative URL is copied absolute, so it still works once pasted elsewhere. It only reads the source, so it stays
 * enabled in read-only mode.
 */
export const MediaSource = (props: MediaSourceProps) => {
	const popoverId = createUniqueId();

	const [copied, setCopied] = createSignal(false);

	let copiedTimeoutId: number | undefined;

	onCleanup(() => {
		clearTimeout(copiedTimeoutId);
	});

	const absoluteSrc = createMemo(() => {
		if (props.src === null) {
			return null;
		}

		const parsedSrc = URL.parse(props.src, document.baseURI);

		return parsedSrc?.href ?? props.src;
	});

	const onCopyClick = () => {
		const src = absoluteSrc();

		if (src === null) {
			return;
		}

		navigator.clipboard.writeText(src);

		setCopied(true);
		clearTimeout(copiedTimeoutId);
		copiedTimeoutId = setTimeout(() => setCopied(false), copiedFeedbackMs);
	};

	return (
		<span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				disabled={props.src === null}
				aria-label={props.label}
				class="btn-menu-trigger flex items-center justify-center rounded-sm p-1"
			>
				<Icon name="SimpleLink" class="size-4" />
			</button>

			<div
				ref={props.popoverRef}
				id={popoverId}
				popover="auto"
				class="mt-1 w-64 items-center justify-between gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-xs [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
			>
				<a
					href={absoluteSrc() ?? undefined}
					target="_blank"
					rel="noopener"
					title={props.src ?? undefined}
					class="min-w-0 truncate font-semibold text-blue-600 text-sm dark:text-blue-400"
				>
					{props.src}
					<span class="sr-only"> (opens in new tab)</span>
				</a>
				<button
					type="button"
					class="btn-neutral-solid shrink-0 rounded-sm p-1"
					onClick={onCopyClick}
				>
					<Icon
						name={copied() ? "Check" : "CopySimple"}
						title={copied() ? "Copied" : "Copy source"}
						class="size-4"
					/>
				</button>
			</div>
		</span>
	);
};
