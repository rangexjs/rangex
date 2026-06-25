import { createMemo, For, type JSX } from "solid-js";

interface Control<Id extends string> {
	id: Id;
	class?: string;
	node: JSX.Element;
}

export type ContentSwitcherControls<Id extends string> = Control<Id>[];

interface ContentSwitcherProps<Id extends string> {
	id: NoInfer<Id>;
	controls: Control<Id>[];
	onChange: (id: Id) => void;
	disabled?: boolean;
	class?: string;
	commonButtonClass?: string;
	activeButtonClass?: string;
	activeBoxShrink?: number;
	activeBoxClass?: string;
}

export const ContentSwitch = <Id extends string>(
	props: ContentSwitcherProps<Id>,
) => {
	const contentSwitcherAnchor = "--content-switcher-anchor";
	const activeBoxShrink = createMemo(() => props.activeBoxShrink ?? 0);

	return (
		<div
			class="flex border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
			classList={{ [props.class ?? ""]: true }}
			style={{ "anchor-scope": contentSwitcherAnchor }}
		>
			<For each={props.controls}>
				{(item) => (
					<button
						class="w-full disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:bg-neutral-800"
						type="button"
						disabled={props.disabled}
						on:click={() => props.onChange(item.id)}
						aria-current={props.id === item.id}
						classList={{
							[props.commonButtonClass ?? ""]: true,
							[item.class ?? ""]: true,
							"text-primary-500": props.id === item.id,
							"dark:text-neutral-300": props.id !== item.id,
							[props.activeButtonClass ?? ""]: props.id === item.id,
						}}
						style={{
							...(props.id === item.id && {
								"anchor-name": contentSwitcherAnchor,
							}),
						}}
					>
						{item.node}
					</button>
				)}
			</For>
			<div
				class="absolute bg-primary-500/10 transition-[left,right]"
				classList={{
					hidden: props.disabled,
					[props.activeBoxClass ?? ""]: true,
				}}
				style={{
					"position-anchor": contentSwitcherAnchor,
					top: `calc(anchor(top) + ${activeBoxShrink()}px)`,
					right: `calc(anchor(right) + ${activeBoxShrink()}px)`,
					bottom: `calc(anchor(bottom) + ${activeBoxShrink()}px)`,
					left: `calc(anchor(left) + ${activeBoxShrink()}px)`,
				}}
			/>
		</div>
	);
};
