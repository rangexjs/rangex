export const commandMenuItemsName = {
	paragraph: "p",
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
	bulletedList: "bulleted-list",
	numberedList: "numbered-list",
	todoList: "todo-list",
	blockQuote: "block-quote",
	codeBlock: "code-block",
	table: "table",
	media: "media",
	accordionItem: "accordion-item",
	separator: "separator",
} as const;

export type CommandMenuItemsName = typeof commandMenuItemsName;

export type CommandMenuItemName = keyof CommandMenuItemsName;

export type CommandMenuItemValue = CommandMenuItemsName[CommandMenuItemName];
