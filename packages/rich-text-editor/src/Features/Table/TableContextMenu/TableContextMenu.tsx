import { FloatingPortal, Table } from "@rangex/solid";
import { createUniqueId, For, onCleanup, Show } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { assertNever } from "#utilities";
import {
	type ActionItem,
	type ContextMenuItem,
	createContextMenuItems,
	type SubmenuItem,
} from "./ContextMenuItems";

interface ActionTriggerProps extends Omit<ActionItem, "type"> {
	mainPopoverId: string;
}

const ActionTrigger = (props: ActionTriggerProps) => {
	const popoverId = createUniqueId();

	return (
		<div class="flex flex-nowrap gap-1">
			<button
				type="button"
				commandfor={props.mainPopoverId}
				command="hide-popover"
				class="btn-menu-item w-full whitespace-nowrap rounded-sm p-1 text-start font-semibold text-sm"
				data-checked={`${!!props.checked()}`}
				onClick={props.onClick}
				disabled={props.disabled()}
			>
				{props.label}
			</button>
			<Show when={props.disabled() && props.info()}>
				<button
					type="button"
					commandfor={popoverId}
					command="toggle-popover"
					class="mr-1 self-center"
				>
					<Icon name="Info" title="More info" class="size-3 text-blue-500" />
				</button>
				<div
					id={popoverId}
					popover="auto"
					class="mt-1.5 w-max max-w-60 overflow-visible rounded-sm border border-neutral-200 bg-white p-1 text-neutral-800 text-xs shadow-xs [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
				>
					<span class="absolute -top-1 left-1/2 inline-block size-2 -translate-x-1/2 rotate-45 border-neutral-200 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-800" />
					{props.info()}
				</div>
			</Show>
		</div>
	);
};

interface SubmenuTriggerProps extends Omit<SubmenuItem, "type"> {
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
				class="btn-menu-item flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-sm p-1 font-semibold text-sm"
			>
				<span>{props.label}</span>
				<Icon
					name="CaretRight"
					class="size-2 shrink-0 text-neutral-700 hover:text-neutral-800 active:text-neutral-900 dark:text-neutral-200 dark:active:text-white dark:hover:text-neutral-100"
				/>
			</button>
			<Menu
				mainPopoverId={props.mainPopoverId}
				popoverId={popoverId}
				items={props.items}
			/>
		</div>
	);
};

interface MenuProps {
	ref?: HTMLDivElement;
	mainPopoverId: string;
	popoverId: string;
	items: ContextMenuItem[];
}

const Menu = (props: MenuProps) => {
	return (
		<div
			ref={props.ref}
			id={props.popoverId}
			popover="auto"
			class="flex-col gap-0.5 rounded-lg border border-neutral-300 bg-white p-1 shadow-sm [position-area:right_span-all] [position-try:flip-inline] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
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
};

export const TableContextMenu = () => {
	const editor = useEditorContext();
	const { table } = editor;

	if (!table) {
		throw new Error("Table can't be undefined.");
	}

	const $table = Table(table);

	const contextMenuItems = createContextMenuItems({ table, $table });

	const popoverId = createUniqueId();

	let subMenu: HTMLDivElement | undefined;

	const closeNestedPopovers = () => {
		if (!subMenu) {
			throw new Error("SubMenu can't be undefined.");
		}

		if (subMenu.matches(":popover-open")) {
			// Force a synchronous reflow before hiding — otherwise the popover can
			// briefly animate from a stale, not-yet-committed style.
			subMenu.offsetHeight;
			subMenu.hidePopover();
		}
	};

	const unsubscribeIsOpen = table.onContextMenuToggle(() => {
		if (!table.contextMenuOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<FloatingPortal mount={table.contextMenuEl}>
			<div class="z-20 inline-flex justify-center overflow-visible bg-transparent">
				<div class="group size-3 leading-0 transition-all hover:size-5 [&:has(+_[popover]:popover-open)]:size-5">
					<button
						type="button"
						class="btn-primary-solid size-full rounded-full"
						commandfor={popoverId}
						command="toggle-popover"
					>
						<Icon
							name="Gear"
							title="Table options"
							class="inline-block size-3 opacity-0 transition-opacity group-hover:opacity-100 [div:has(+_[popover]:popover-open)_&]:opacity-100"
						/>
					</button>
				</div>

				<Menu
					ref={subMenu}
					mainPopoverId={popoverId}
					popoverId={popoverId}
					items={contextMenuItems}
				/>
			</div>
		</FloatingPortal>
	);
};
