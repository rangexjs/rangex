import type { SlotStatus } from "../SourcePlaceholderSlot-types";

interface StatusIndicatorProps {
	status: SlotStatus;
}

export const StatusIndicator = (props: StatusIndicatorProps) => {
	const progress = () => (props.status.status === "uploading" ? props.status.progress : 0);

	const isVisible = () => props.status.status === "checking" || props.status.status === "uploading";

	return (
		<div
			role="status"
			class={[
				"mx-auto w-full max-w-125 flex-col items-center gap-2 text-neutral-500 text-sm dark:text-neutral-400",
				{ flex: isVisible(), hidden: !isVisible() },
			]}
		>
			<span hidden={props.status.status !== "checking"}>Checking…</span>
			<span hidden={props.status.status !== "uploading"}>
				Uploading… {Math.round(progress() * 100)}%
			</span>
		</div>
	);
};
