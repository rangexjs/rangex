import type { CommandMenuItemValue } from "./CommandMenuItemsName";
import { commandMenuItemsName } from "./CommandMenuItemsName";

export const commandMenuItemsLabel: Record<CommandMenuItemValue, string> = {
	[commandMenuItemsName.paragraph]: "Paragraph",
	[commandMenuItemsName.h1]: "Heading 1",
	[commandMenuItemsName.h2]: "Heading 2",
	[commandMenuItemsName.h3]: "Heading 3",
	[commandMenuItemsName.h4]: "Heading 4",
	[commandMenuItemsName.h5]: "Heading 5",
	[commandMenuItemsName.h6]: "Heading 6",
	[commandMenuItemsName.bulletedList]: "Bulleted list",
	[commandMenuItemsName.numberedList]: "Numbered list",
	[commandMenuItemsName.todoList]: "Todo list",
	[commandMenuItemsName.blockQuote]: "Block quote",
	[commandMenuItemsName.codeBlock]: "Code block",
	[commandMenuItemsName.table]: "Table",
	[commandMenuItemsName.media]: "Media",
	[commandMenuItemsName.accordionItem]: "Accordion item",
};
