import { createMemo, For, type JSX } from "solid-js";
import { cn } from "../../../Utilities";

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
		track: string;
		button: string;
		activeBox: string;
		activeBoxShrink: number;
	}
> = {
	"primary-outline": {
		track: cn([
			"border border-neutral-200 dark:border-neutral-700",
			"bg-neutral-100 dark:bg-neutral-800",
		]),
		button: cn([
			"text-neutral-600 dark:text-neutral-300",
			"aria-[current=true]:text-primary-600 aria-[current=true]:dark:text-primary-500",
			"disabled:bg-neutral-100 dark:disabled:bg-neutral-800",
			"disabled:text-neutral-400 dark:disabled:text-neutral-600",
		]),
		activeBox: cn([
			"rounded-sm",
			"border border-primary-500/40",
			"bg-primary-500/10",
		]),
		activeBoxShrink: -1,
	},
};

interface SegmentedControlProps<Id extends string> {
	id: NoInfer<Id>;
	controls: SegmentedControlControls<Id>;
	onChange: (id: Id) => void;
	appearance: SegmentedControlAppearance;
	disabled?: boolean;
	class?: string;
	commonButtonClass?: string;
}

export const SegmentedControl = <Id extends string>(
	props: SegmentedControlProps<Id>,
) => {
	const anchorName = "--segmented-control";
	const styles = createMemo(() => appearanceStyles[props.appearance]);

	return (
		<div
			class="relative flex"
			classList={{
				[styles().track]: true,
				[props.class ?? ""]: true,
			}}
			style={{ "anchor-scope": anchorName }}
		>
			<For each={props.controls}>
				{(item) => (
					<button
						class="w-full"
						type="button"
						disabled={props.disabled}
						on:click={() => props.onChange(item.id)}
						aria-current={props.id === item.id}
						aria-label={item["aria-label"]}
						classList={{
							[styles().button]: true,
							[props.commonButtonClass ?? ""]: true,
						}}
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
				class="absolute transition-[left,right]"
				classList={{
					hidden: props.disabled,
					[styles().activeBox]: true,
				}}
				style={{
					"position-anchor": anchorName,
					top: `calc(anchor(top) + ${styles().activeBoxShrink}px)`,
					right: `calc(anchor(right) + ${styles().activeBoxShrink}px)`,
					bottom: `calc(anchor(bottom) + ${styles().activeBoxShrink}px)`,
					left: `calc(anchor(left) + ${styles().activeBoxShrink}px)`,
				}}
			/>
		</div>
	);
};
