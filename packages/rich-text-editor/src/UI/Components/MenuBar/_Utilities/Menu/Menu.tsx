import { createUniqueId, For } from "solid-js";
import { assertNever } from "#ports";
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
		class="btn-menu-item w-full whitespace-nowrap rounded-sm p-1 text-start font-semibold text-xs"
		data-is-checked={props.checked()}
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
				class="btn-menu-item flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-sm p-1 font-semibold text-xs"
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
