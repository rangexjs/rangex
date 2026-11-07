import { CommandMenu } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext, useUIOptionsContext } from "#context";
import { Icon } from "#ui";
import {
	type CaretItemFn,
	CaretMenu,
	filterCaretMenuItems,
} from "../../_Utilities";
import type { CommandMenuAction } from "./BuildCommandMenuActions";
import { buildCommandMenuActions } from "./BuildCommandMenuActions";

export const CommandMenuCaretMenu = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();
	const { commandMenu } = editor;

	if (!commandMenu) {
		throw new Error("CommandMenu can't be undefined.");
	}

	const $commandMenu = CommandMenu(commandMenu);

	const actions = buildCommandMenuActions({ editor, uiOptions });

	// The items available at the selection that have an action
	const availableEntries = createMemo(() =>
		$commandMenu
			.availableItems()
			.map((value) => {
				const action = actions.get(value);

				return action ? { value, action } : null;
			})
			.filter((entry) => entry !== null),
	);

	const entries = createMemo(() =>
		filterCaretMenuItems({
			items: availableEntries(),
			query: $commandMenu.caretMenu.query(),
			getKeys: (entry) => [entry.action.label],
		}),
	);

	const selectEntry = (action: CommandMenuAction) => {
		commandMenu.beforeSelect();
		action.onSelect();
	};

	const items = () =>
		entries().map(({ action }): CaretItemFn => {
			return ({ isActive }) => (
				<button
					type="button"
					class={[
						"flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-left text-sm active:bg-neutral-200 active:dark:bg-neutral-700",
						{ "bg-neutral-100 dark:bg-neutral-800": isActive() },
					]}
					onClick={() => selectEntry(action)}
				>
					<Icon name={action.icon} class="size-4" />
					<span>{action.label}</span>
				</button>
			);
		});

	const onSelect = (index: number) => {
		const entry = entries().at(index);

		if (!entry) {
			return;
		}

		selectEntry(entry.action);
	};

	return (
		<CaretMenu
			caretMenuPort={commandMenu.caretMenu}
			items={items}
			onSelect={onSelect}
			class="min-w-48 max-w-64"
		/>
	);
};
