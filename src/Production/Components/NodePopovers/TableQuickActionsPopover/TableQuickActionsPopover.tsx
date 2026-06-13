import {
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { assertNever } from "../../../ErrorHandling";
import type {
	TableQuickActionsCellResizingState,
	TableQuickActionsCellTypeState,
	TableQuickActionsClearContentsState,
	TableQuickActionsInsertDeleteState,
	TableQuickActionsMergeSplitState,
	TableQuickActionsSectionTypeState,
	TableQuickActionsVerticalAlignmentState,
} from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";
import { Icon } from "../../Icon";
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
				class="w-full whitespace-nowrap rounded-sm border border-transparent p-1 text-start font-semibold text-neutral-700 text-sm transition-colors"
				classList={{
					"hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800":
						!props.checked(),
					"active:border-neutral-400 active:text-neutral-900": !props.checked(),
					"disabled:text-neutral-400": true,
					"bg-primary-500/10 text-primary-400": props.checked(),
					"hover:bg-primary-500/15": props.checked(),
					"text-primary-500 active:border-primary-500/30": props.checked(),
					"pointer-events-none": props.disabled(),
				}}
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
					class="mt-1.5 w-max max-w-60 overflow-visible rounded-sm border border-neutral-200 p-1 text-neutral-800 text-xs shadow-xs [position-area:center_bottom]"
				>
					<span class="absolute -top-1 left-1/2 inline-block size-2 -translate-x-1/2 rotate-45 border-neutral-200 border-t border-l bg-white" />
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
				class="flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-sm border border-transparent p-1 font-semibold text-neutral-700 text-sm transition-colors"
				classList={{
					"hover:border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800": true,
					"active:border-neutral-400 active:text-neutral-900": true,
				}}
			>
				<span>{props.label}</span>
				<Icon
					name="CaretRight"
					class="size-2 shrink-0 text-neutral-700 hover:text-neutral-800 active:text-neutral-900"
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
			class="flex-col gap-0.5 rounded-lg border border-neutral-300 p-1 shadow-sm [position-area:right_center] [&:popover-open]:flex"
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

export const TableQuickActionsPopover = () => {
	const { tableQuickActionsPopoverController: controller } =
		usePopoverControllersContext();

	const [sectionType, setSectionType] =
		createSignal<TableQuickActionsSectionTypeState>(controller.sectionType);
	const [mergeSplit, setMergeSplit] =
		createSignal<TableQuickActionsMergeSplitState>(controller.mergeSplit);
	const [insertDelete, setInsertDelete] =
		createSignal<TableQuickActionsInsertDeleteState>(controller.insertDelete);
	const [cellType, setCellType] = createSignal<TableQuickActionsCellTypeState>(
		controller.cellType,
	);
	const [verticalAlignment, setVerticalAlignment] =
		createSignal<TableQuickActionsVerticalAlignmentState>(
			controller.verticalAlignment,
		);
	const [cellResizing, setCellResizing] =
		createSignal<TableQuickActionsCellResizingState>(controller.cellResizing);
	const [clearContents, setClearContents] =
		createSignal<TableQuickActionsClearContentsState>(controller.clearContents);

	const popoverId = createUniqueId();

	let subMenu: HTMLDivElement | undefined;

	onMount(() => {
		controller.subscribe({ type: "sectionType", callback: setSectionType });
		controller.subscribe({ type: "mergeSplit", callback: setMergeSplit });
		controller.subscribe({ type: "insertDelete", callback: setInsertDelete });
		controller.subscribe({ type: "cellType", callback: setCellType });
		controller.subscribe({
			type: "verticalAlignment",
			callback: setVerticalAlignment,
		});
		controller.subscribe({ type: "cellResizing", callback: setCellResizing });
		controller.subscribe({ type: "clearContents", callback: setClearContents });
	});

	onCleanup(() => {
		controller.unsubscribe({ type: "sectionType", callback: setSectionType });
		controller.unsubscribe({ type: "mergeSplit", callback: setMergeSplit });
		controller.unsubscribe({ type: "insertDelete", callback: setInsertDelete });
		controller.unsubscribe({ type: "cellType", callback: setCellType });
		controller.unsubscribe({
			type: "verticalAlignment",
			callback: setVerticalAlignment,
		});
		controller.unsubscribe({ type: "cellResizing", callback: setCellResizing });
		controller.unsubscribe({
			type: "clearContents",
			callback: setClearContents,
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
		controller,
	});

	const onToggle = (e: ToggleEvent) => {
		if (e.newState !== "closed") {
			return;
		}

		if (!subMenu) {
			throw new Error("SubMenu can't be undefined.");
		}

		subMenu.hidePopover();
	};

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			popover="manual"
			class="overflow-hidden bg-transparent"
			on:toggle={onToggle}
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
