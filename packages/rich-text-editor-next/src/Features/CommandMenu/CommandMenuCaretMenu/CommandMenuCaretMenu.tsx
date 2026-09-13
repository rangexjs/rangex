import { CommandMenu } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { type CaretItemFn, CaretMenu, Icon } from "#ui";
import type { CommandMenuAction } from "./BuildCommandMenuActions";
import { buildCommandMenuActions } from "./BuildCommandMenuActions";

export const CommandMenuCaretMenu = () => {
	const editor = useEditorContext();
	const commandMenu = CommandMenu(editor.commandMenu);

	if (!commandMenu) {
		throw new Error("CommandMenu can't be undefined.");
	}

	const actions = createMemo(() => buildCommandMenuActions({ editor }));

	const entries = createMemo(() =>
		commandMenu
			.filteredItems()
			.map((item) => {
				const action = actions().get(item.value);
				return action ? { item, action } : null;
			})
			.filter((entry) => entry !== null),
	);

	const selectEntry = (action: CommandMenuAction) => {
		commandMenu.beforeSelect();
		action.onSelect();
	};

	const items = () =>
		entries().map(({ item, action }): CaretItemFn => {
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
					<span>{item.label}</span>
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
			caretMenuEl={commandMenu.caretMenuEl}
			items={items}
			isOpen={commandMenu.caretMenuOpen}
			onSelect={onSelect}
			class="min-w-48 max-w-64"
		/>
	);
};
