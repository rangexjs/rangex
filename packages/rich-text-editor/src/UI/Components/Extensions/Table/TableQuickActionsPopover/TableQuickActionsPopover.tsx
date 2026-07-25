import {
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import type {
	TableCellResizingState,
	TableCellTypeState,
	TableClearContentsState,
	TableInsertDeleteState,
	TableMergeSplitState,
	TableSectionTypeState,
	TableUIPort,
	TableVerticalAlignmentState,
} from "#adapters";
import { assertNever } from "../../../../ErrorHandling";
import { Icon } from "../../../Icon";
import {
	type ActionItem,
	createQuickActionItems,
	type QuickActionItem,
	type SubmenuItem,
} from "./QuickActionItems";

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
				data-is-checked={props.checked()}
				on:click={props.onClick}
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
					<Icon name="Info" class="size-3 text-blue-500" />
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
	items: QuickActionItem[];
}

const Menu = (props: MenuProps) => {
	return (
		<div
			ref={props.ref}
			id={props.popoverId}
			popover="auto"
			class="flex-col gap-0.5 rounded-lg border border-neutral-300 bg-white p-1 shadow-sm [position-area:right_center] dark:border-neutral-700 dark:bg-neutral-900 [&:popover-open]:flex"
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

interface TableQuickActionsPopoverProps {
	uiPort: TableUIPort;
}

export const TableQuickActionsPopover = (
	props: TableQuickActionsPopoverProps,
) => {
	const uiPort = props.uiPort;

	const [sectionType, setSectionType] = createSignal<TableSectionTypeState>(
		uiPort.sectionType,
	);
	const [mergeSplit, setMergeSplit] = createSignal<TableMergeSplitState>(
		uiPort.mergeSplit,
	);
	const [insertDelete, setInsertDelete] = createSignal<TableInsertDeleteState>(
		uiPort.insertDelete,
	);
	const [cellType, setCellType] = createSignal<TableCellTypeState>(
		uiPort.cellType,
	);
	const [verticalAlignment, setVerticalAlignment] =
		createSignal<TableVerticalAlignmentState>(uiPort.verticalAlignment);
	const [cellResizing, setCellResizing] = createSignal<TableCellResizingState>(
		uiPort.cellResizing,
	);
	const [clearContents, setClearContents] =
		createSignal<TableClearContentsState>(uiPort.clearContents);

	const popoverId = createUniqueId();

	let subMenu: HTMLDivElement | undefined;

	onMount(() => {
		const unsubscribeSectionType = uiPort.onSectionTypeUpdate(setSectionType);
		const unsubscribeMergeSplit = uiPort.onMergeSplitUpdate(setMergeSplit);
		const unsubscribeInsertDelete =
			uiPort.onInsertDeleteUpdate(setInsertDelete);
		const unsubscribeCellType = uiPort.onCellTypeUpdate(setCellType);
		const unsubscribeVerticalAlignment =
			uiPort.onVerticalAlignmentUpdate(setVerticalAlignment);
		const unsubscribeCellResizing =
			uiPort.onCellResizingUpdate(setCellResizing);
		const unsubscribeClearContents =
			uiPort.onClearContentsUpdate(setClearContents);

		onCleanup(() => {
			unsubscribeSectionType();
			unsubscribeMergeSplit();
			unsubscribeInsertDelete();
			unsubscribeCellType();
			unsubscribeVerticalAlignment();
			unsubscribeCellResizing();
			unsubscribeClearContents();
		});
	});

	const quickActionItems = createQuickActionItems({
		sectionType,
		mergeSplit,
		insertDelete,
		cellType,
		verticalAlignment,
		cellResizing,
		clearContents,
		uiPort,
	});

	const onBeforeToggle = () => {
		if (!subMenu) {
			throw new Error("SubMenu can't be undefined.");
		}

		const isOpen = subMenu.matches(":popover-open");

		if (isOpen) {
			subMenu.hidePopover();
		}
	};

	return (
		<div
			ref={(el) => uiPort.popover.setElement(el)}
			popover="manual"
			class="overflow-hidden bg-transparent"
			on:beforetoggle={onBeforeToggle}
		>
			<div class="group size-3 leading-0 transition-all hover:size-5 [&:has(+_[popover]:popover-open)]:size-5">
				<button
					type="button"
					class="btn-primary-solid size-full rounded-full"
					commandfor={popoverId}
					command="toggle-popover"
				>
					<Icon
						name="Gear"
						class="inline-block size-3 opacity-0 transition-opacity group-hover:opacity-100 [div:has(+_[popover]:popover-open)_&]:opacity-100"
					/>
				</button>
			</div>

			<Menu
				ref={subMenu}
				mainPopoverId={popoverId}
				popoverId={popoverId}
				items={quickActionItems}
			/>
		</div>
	);
};
