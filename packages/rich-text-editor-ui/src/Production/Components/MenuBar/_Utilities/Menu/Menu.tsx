import { createUniqueId, For } from "solid-js";
import { assertNever } from "../../../../ErrorHandling";
import { Icon } from "../../../Icon";

export interface MenuButtonItem {
	type: "button";
	label: string;
	checked: () => boolean | undefined;
	onClick: () => void;
}

export interface MenuSubmenuItem {
	type: "submenu";
	label: string;
	items: MenuItem[];
}

export type MenuItem = MenuButtonItem | MenuSubmenuItem;

interface ActionTriggerProps extends Omit<MenuButtonItem, "type"> {
	mainPopoverId: string;
}

const ActionTrigger = (props: ActionTriggerProps) => (
	<button
		type="button"
		commandfor={props.mainPopoverId}
		command="hide-popover"
		class="w-full whitespace-nowrap rounded-sm border border-transparent p-1 text-start font-semibold text-xs transition-colors"
		classList={{
			"text-neutral-700 hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-400 active:text-neutral-900 dark:text-neutral-200 dark:active:border-neutral-500 dark:active:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100":
				!props.checked(),
			"bg-primary-500/10 text-primary-500 hover:bg-primary-500/15 active:border-primary-500/30":
				!!props.checked(),
		}}
		on:click={props.onClick}
	>
		{props.label}
	</button>
);

interface SubmenuTriggerProps extends Omit<MenuSubmenuItem, "type"> {
	mainPopoverId: string;
}

const SubmenuTrigger = (props: SubmenuTriggerProps) => {
	const popoverId = createUniqueId();

	return (
		<div>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-sm border border-transparent p-1 font-semibold text-neutral-700 text-xs transition-colors hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-400 active:text-neutral-900 dark:text-neutral-200 dark:active:border-neutral-500 dark:active:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
			>
				<span>{props.label}</span>
				<Icon
					name="CaretRight"
					class="size-2 shrink-0 text-neutral-700 dark:text-neutral-200"
				/>
			</button>
			<Submenu
				mainPopoverId={props.mainPopoverId}
				popoverId={popoverId}
				items={props.items}
			/>
		</div>
	);
};

export interface MenuProps {
	ref?: HTMLDivElement;
	mainPopoverId: string;
	popoverId: string;
	items: MenuItem[];
}

interface MenuBaseProps extends MenuProps {
	class: string;
}

const MenuBase = (props: MenuBaseProps) => (
	<div
		ref={props.ref}
		id={props.popoverId}
		popover="auto"
		class="flex-col gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-xs dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
		classList={{ [props.class]: true }}
	>
		<For each={props.items}>
			{(item) => {
				if (item.type === "button") {
					return (
						<ActionTrigger mainPopoverId={props.mainPopoverId} {...item} />
					);
				}

				if (item.type === "submenu") {
					return (
						<SubmenuTrigger mainPopoverId={props.mainPopoverId} {...item} />
					);
				}

				return assertNever(item);
			}}
		</For>
	</div>
);

const Submenu = (props: MenuProps) => (
	<MenuBase {...props} class="[position-area:right_center]" />
);

export const Menu = (props: MenuProps) => (
	<MenuBase {...props} class="[position-area:span-right_bottom]" />
);
