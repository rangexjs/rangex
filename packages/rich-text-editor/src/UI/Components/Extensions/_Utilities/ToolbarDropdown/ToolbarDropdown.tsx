import { Index, type JSX, Show } from "solid-js";
import { Icon, type IconName } from "../../../Icon";

export type ToolbarDropdownList = {
	checked?: boolean;
	icon?: IconName;
	text: string;
	button: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
	settings?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
}[];

interface ToolbarDropdownProps {
	id: string;
	class?: string;
	style?: JSX.CSSProperties;
	list: ToolbarDropdownList;
	onToggle?: (event: ToggleEvent) => void;
}

export const ToolbarDropdown = (props: ToolbarDropdownProps) => {
	return (
		<div
			id={props.id}
			popover="auto"
			on:toggle={props.onToggle}
			class="scrollbar-thin mt-1 max-h-[min(100%,360px)] rounded-md border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
			classList={{ [props.class ?? ""]: true }}
			style={props.style}
		>
			<ul class="space-y-0.5">
				<Index each={props.list}>
					{(item) => (
						<li class="flex gap-0.5">
							<button
								commandfor={props.id}
								command="hide-popover"
								{...item().button}
								type="button"
								class="flex w-full items-center gap-2 whitespace-nowrap rounded-xs border border-transparent px-2 py-1 font-semibold text-xs transition-colors"
								classList={{
									"text-neutral-700 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-300 active:text-neutral-900 dark:text-neutral-200 dark:active:border-neutral-600 dark:active:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100":
										!item().checked,
									"bg-primary-500/10 text-primary-500 hover:border-primary-500/20 active:border-primary-500/30":
										item().checked,
									[item().button.class ?? ""]: true,
								}}
							>
								<Show when={item().icon}>
									{(icon) => <Icon name={icon()} class="size-3 shrink-0" />}
								</Show>
								<span class="">{item().text}</span>
							</button>
							<Show when={item().settings}>
								<button
									type="button"
									commandfor={props.id}
									command="hide-popover"
									class="rounded-xs border border-transparent px-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:border-neutral-200 dark:text-neutral-200 dark:active:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
									{...item().settings}
								>
									<Icon name="Gear" class="size-3" />
								</button>
							</Show>
						</li>
					)}
				</Index>
			</ul>
		</div>
	);
};
