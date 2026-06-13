import { Index, type JSX, Show } from "solid-js";
import { Icon } from "../../Icon";

export type DropdownList = {
	checked?: boolean;
	text: string;
	button: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
	settings?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
}[];

interface DropdownProps {
	id: string;
	class?: string;
	style?: JSX.CSSProperties;
	list: DropdownList;
	onToggle?: (event: ToggleEvent) => void;
}

export const Dropdown = (props: DropdownProps) => {
	return (
		<div
			id={props.id}
			popover="auto"
			on:toggle={props.onToggle}
			class="mt-1 max-h-[min(100%,360px)] rounded-md border border-neutral-200 p-1 shadow-sm [scrollbar-width:thin]"
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
									"text-neutral-700 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-300 active:text-neutral-900":
										!item().checked,
									"bg-primary-500/10 text-primary-500 hover:border-primary-500/20 active:border-primary-500/30":
										item().checked,
									[item().button.class ?? ""]: true,
								}}
							>
								<span class="">{item().text}</span>
							</button>
							<Show when={item().settings}>
								<button
									type="button"
									commandfor={props.id}
									command="hide-popover"
									class="rounded-xs border border-transparent px-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:border-neutral-200"
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
