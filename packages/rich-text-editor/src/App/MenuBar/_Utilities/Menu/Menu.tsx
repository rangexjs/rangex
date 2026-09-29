import { createUniqueId, For } from "solid-js";
import { Icon } from "#ui";
import { assertNever } from "#utilities";
import type { MenuButtonItem, MenuProps, MenuSubmenuItem } from "./Menu-types";

interface ActionTriggerProps extends Omit<MenuButtonItem, "type"> {
	mainPopoverId: string;
}

const ActionTrigger = (props: ActionTriggerProps) => (
	<button
		type="button"
		commandfor={props.mainPopoverId}
		command="hide-popover"
		class="btn-menu-item w-full whitespace-nowrap rounded-sm p-1 text-start font-semibold text-xs"
		data-checked={`${!!props.checked()}`}
		aria-pressed={`${!!props.checked()}`}
		onClick={props.onClick}
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

interface MenuBaseProps extends MenuProps {
	class: string;
}

const MenuBase = (props: MenuBaseProps) => (
	<div
		ref={props.ref}
		id={props.popoverId}
		popover="auto"
		class={[
			"flex-col gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-xs [position-try:flip-inline] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex",
			props.class,
		]}
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
	<MenuBase {...props} class="[position-area:right_span-all]" />
);

export const Menu = (props: MenuProps) => (
	<MenuBase {...props} class="[position-area:span-right_bottom]" />
);
