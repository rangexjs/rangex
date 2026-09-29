import type { JSX } from "@solidjs/web";
import { createMemo, For } from "solid-js";

interface Control<Id extends string> {
	id: Id;
	"aria-label"?: string;
	node: JSX.Element;
}

export type SegmentedControlControls<Id extends string> = Control<Id>[];

type SegmentedControlAppearance = "primary-outline";

const appearanceStyles: Record<
	SegmentedControlAppearance,
	{
		track: JSX.ClassValue;
		button: JSX.ClassValue;
		activeBox: JSX.ClassValue;
		activeBoxShrink: number;
	}
> = {
	"primary-outline": {
		track: [
			"border border-neutral-200 dark:border-neutral-700",
			"bg-neutral-100 dark:bg-neutral-800",
		],
		button: [
			"text-neutral-600 dark:text-neutral-300",
			"aria-pressed:text-primary-600 aria-pressed:dark:text-primary-500",
			"disabled:bg-neutral-100 dark:disabled:bg-neutral-800",
			"disabled:text-neutral-400 dark:disabled:text-neutral-600",
		],
		activeBox: [
			"rounded-sm",
			"border border-primary-500/40",
			"bg-primary-500/10",
		],
		activeBoxShrink: -1,
	},
};

interface SegmentedControlProps<Id extends string> {
	id: NoInfer<Id>;
	controls: SegmentedControlControls<Id>;
	onChange: (id: Id) => void;
	label: string;
	appearance: SegmentedControlAppearance;
	disabled?: boolean;
	class?: JSX.ClassValue;
	commonButtonClass?: JSX.ClassValue;
}

export const SegmentedControl = <Id extends string>(
	props: SegmentedControlProps<Id>,
) => {
	const anchorName = "--segmented-control";
	const styles = createMemo(() => appearanceStyles[props.appearance]);

	return (
		<fieldset
			aria-label={props.label}
			class={["relative flex min-w-0", styles().track, props.class]}
			style={{ "anchor-scope": anchorName }}
		>
			<For each={props.controls}>
				{(item) => (
					<button
						class={["w-full", styles().button, props.commonButtonClass]}
						type="button"
						disabled={props.disabled}
						onClick={() => props.onChange(item.id)}
						aria-pressed={`${props.id === item.id}`}
						aria-label={item["aria-label"]}
						style={{
							...(props.id === item.id && {
								"anchor-name": anchorName,
							}),
						}}
					>
						{item.node}
					</button>
				)}
			</For>
			<div
				class={[
					"absolute transition-[left,right]",
					styles().activeBox,
					{ hidden: !!props.disabled },
				]}
				style={{
					"position-anchor": anchorName,
					top: `calc(anchor(top) + ${styles().activeBoxShrink}px)`,
					right: `calc(anchor(right) + ${styles().activeBoxShrink}px)`,
					bottom: `calc(anchor(bottom) + ${styles().activeBoxShrink}px)`,
					left: `calc(anchor(left) + ${styles().activeBoxShrink}px)`,
				}}
			/>
		</fieldset>
	);
};
