import type { FormattingLineLocalNameValue } from "#adapters";
import { commandMenuItemsName } from "#ports";
import { useUIPortsContext } from "../../App";
import type { IconName } from "../../Icon";
import type {
	BuildCommandMenuActionsParams,
	CommandMenuItemEntry,
} from "./BuildCommandMenuActions-types";

interface HeadingEntry {
	name: CommandMenuItemEntry["name"];
	lineLocalName: FormattingLineLocalNameValue;
	icon: IconName;
}

const headingEntries: HeadingEntry[] = [
	{
		name: commandMenuItemsName.paragraph,
		lineLocalName: "p",
		icon: "Paragraph",
	},
	{ name: commandMenuItemsName.h1, lineLocalName: "h1", icon: "TextHOne" },
	{ name: commandMenuItemsName.h2, lineLocalName: "h2", icon: "TextHTwo" },
	{ name: commandMenuItemsName.h3, lineLocalName: "h3", icon: "TextHThree" },
	{ name: commandMenuItemsName.h4, lineLocalName: "h4", icon: "TextHFour" },
	{ name: commandMenuItemsName.h5, lineLocalName: "h5", icon: "TextHFive" },
	{ name: commandMenuItemsName.h6, lineLocalName: "h6", icon: "TextHSix" },
];

/**
 * Each entry pairs an item with the specific owning extension's action to call on select — an
 * item whose extension isn't included has no entry here, so it never renders at all. The result
 * is ordered to match `items`, the configured display order. Reads each owning port straight from
 * context so `CommandMenu` itself never has to grow a parameter per new item.
 */
export const buildCommandMenuActions = ({
	items,
}: BuildCommandMenuActionsParams): CommandMenuItemEntry[] => {
	const {
		blockQuoteUIPort,
		emptyMediaUIPort,
		formattingUIPort,
		listUIPort,
		todoListUIPort,
		codeBlockUIPort,
		tableUIPort,
		accordionItemUIPort,
		separatorUIPort,
	} = useUIPortsContext();

	const entries: CommandMenuItemEntry[] = [];

	if (blockQuoteUIPort) {
		entries.push({
			name: commandMenuItemsName.blockQuote,
			action: {
				icon: "BlockQuote",
				onSelect: () => blockQuoteUIPort.emitInsertRequest(),
			},
		});
	}

	if (emptyMediaUIPort) {
		entries.push({
			name: commandMenuItemsName.media,
			action: {
				icon: "FileArrowUp",
				onSelect: () => emptyMediaUIPort.emitInsertRequest(),
			},
		});
	}

	if (formattingUIPort) {
		for (const { name, lineLocalName, icon } of headingEntries) {
			entries.push({
				name,
				action: {
					icon,
					onSelect: () =>
						formattingUIPort.emitFormattingChange({ lineLocalName }),
				},
			});
		}
	}

	if (listUIPort) {
		entries.push({
			name: commandMenuItemsName.bulletedList,
			action: {
				icon: "ListBullets",
				onSelect: () =>
					listUIPort.emitInsertRequest({ type: "unordered-list" }),
			},
		});

		entries.push({
			name: commandMenuItemsName.numberedList,
			action: {
				icon: "ListNumbers",
				onSelect: () => listUIPort.emitInsertRequest({ type: "ordered-list" }),
			},
		});
	}

	if (todoListUIPort) {
		entries.push({
			name: commandMenuItemsName.todoList,
			action: {
				icon: "ListChecks",
				onSelect: () => todoListUIPort.emitInsertRequest(),
			},
		});
	}

	if (codeBlockUIPort) {
		entries.push({
			name: commandMenuItemsName.codeBlock,
			action: {
				icon: "CodeBlock",
				onSelect: () =>
					codeBlockUIPort.emitInsertRequest({ language: "typescript" }),
			},
		});
	}

	if (tableUIPort) {
		entries.push({
			name: commandMenuItemsName.table,
			action: {
				icon: "Table",
				onSelect: () => tableUIPort.emitInsertRequest({ row: 5, column: 5 }),
			},
		});
	}

	if (accordionItemUIPort) {
		entries.push({
			name: commandMenuItemsName.accordionItem,
			action: {
				icon: "CaretCircleRight",
				onSelect: () => accordionItemUIPort.emitInsertRequest(),
			},
		});
	}

	if (separatorUIPort) {
		entries.push({
			name: commandMenuItemsName.separator,
			action: {
				icon: "Separator",
				onSelect: () => separatorUIPort.emitInsertRequest(),
			},
		});
	}

	const orderedEntries: CommandMenuItemEntry[] = [];

	for (const name of items) {
		const entry = entries.find((candidate) => candidate.name === name);

		if (entry) {
			orderedEntries.push(entry);
		}
	}

	return orderedEntries;
};
