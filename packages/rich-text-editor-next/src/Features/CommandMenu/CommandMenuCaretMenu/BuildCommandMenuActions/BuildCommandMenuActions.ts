import type {
	BuildCommandMenuActionsParams,
	BuildCommandMenuActionsResult,
	CommandActions,
} from "./BuildCommandMenuActions-types";

/**
 * Maps each command menu item to the specific owning extension's action to call on select — an
 * item whose owning port isn't present isn't included, so it never renders at all. Constructs
 * every owning port itself from the raw editor, so CommandMenuCaretMenu never has to grow a
 * parameter per new item.
 */
export const buildCommandMenuActions = ({
	editor,
}: BuildCommandMenuActionsParams): BuildCommandMenuActionsResult => {
	const {
		blockQuote,
		accordionItem,
		codeBlock,
		emptyMedia,
		formatting,
		list,
		separator,
		table,
		todoList,
	} = editor;

	const actions: CommandActions = new Map();

	if (formatting) {
		actions.set("p", {
			icon: "Paragraph",
			onSelect: () => formatting.setLineLocalName("p"),
		});
		actions.set("h1", {
			icon: "TextHOne",
			onSelect: () => formatting.setLineLocalName("h1"),
		});
		actions.set("h2", {
			icon: "TextHTwo",
			onSelect: () => formatting.setLineLocalName("h2"),
		});
		actions.set("h3", {
			icon: "TextHThree",
			onSelect: () => formatting.setLineLocalName("h3"),
		});
		actions.set("h4", {
			icon: "TextHFour",
			onSelect: () => formatting.setLineLocalName("h4"),
		});
		actions.set("h5", {
			icon: "TextHFive",
			onSelect: () => formatting.setLineLocalName("h5"),
		});
		actions.set("h6", {
			icon: "TextHSix",
			onSelect: () => formatting.setLineLocalName("h6"),
		});
	}

	if (list) {
		actions.set("bulleted-list", {
			icon: "ListBullets",
			onSelect: () => list.insert({ localName: "ul" }),
		});
		actions.set("numbered-list", {
			icon: "ListNumbers",
			onSelect: () => list.insert({ localName: "ol" }),
		});
	}

	if (todoList) {
		actions.set("todo-list", {
			icon: "ListChecks",
			onSelect: () => todoList.insert(),
		});
	}

	if (blockQuote) {
		actions.set("block-quote", {
			icon: "BlockQuote",
			onSelect: () => blockQuote.insert(),
		});
	}

	if (codeBlock) {
		actions.set("code-block", {
			icon: "CodeBlock",
			onSelect: () => codeBlock.insert({ language: "TypeScript" }),
		});
	}

	if (table) {
		actions.set("table", {
			icon: "Table",
			onSelect: () => table.insert({ row: 5, column: 5 }),
		});
	}

	if (emptyMedia) {
		actions.set("media", {
			icon: "FileArrowUp",
			onSelect: () => emptyMedia.insert(),
		});
	}

	if (accordionItem) {
		actions.set("accordion-item", {
			icon: "CaretCircleRight",
			onSelect: () => accordionItem.insert(),
		});
	}

	if (separator) {
		actions.set("separator", {
			icon: "Separator",
			onSelect: () => separator.insert(),
		});
	}

	return actions;
};
