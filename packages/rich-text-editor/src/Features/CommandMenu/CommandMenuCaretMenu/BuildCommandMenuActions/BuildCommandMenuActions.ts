import { accordionItemAttrs } from "../../../_Utilities";
import type {
	BuildCommandMenuActionsParams,
	BuildCommandMenuActionsResult,
	CommandActions,
} from "./BuildCommandMenuActions-types";

/**
 * Maps each command menu item to its label and the specific owning extension's action to call on
 * select — an item whose owning port isn't present isn't included, so it never renders at all.
 * Which items are available at the selection is the CommandMenu's availableItems. Reads every
 * owning port itself from the raw editor, so CommandMenuCaretMenu never has to grow a parameter
 * per new item.
 */
export const buildCommandMenuActions = ({
	editor,
	uiOptions,
}: BuildCommandMenuActionsParams): BuildCommandMenuActionsResult => {
	const {
		blockQuote,
		accordionItem,
		codeBlock,
		sourcePlaceholder,
		formatting,
		list,
		separator,
		table,
		todoList,
	} = editor;

	const actions: CommandActions = new Map();

	if (formatting) {
		actions.set("p", {
			label: "Text",
			icon: "Paragraph",
			onSelect: () => formatting.setLineLocalName("p"),
		});
		actions.set("h1", {
			label: "Heading 1",
			icon: "TextHOne",
			onSelect: () => formatting.setLineLocalName("h1"),
		});
		actions.set("h2", {
			label: "Heading 2",
			icon: "TextHTwo",
			onSelect: () => formatting.setLineLocalName("h2"),
		});
		actions.set("h3", {
			label: "Heading 3",
			icon: "TextHThree",
			onSelect: () => formatting.setLineLocalName("h3"),
		});
		actions.set("h4", {
			label: "Heading 4",
			icon: "TextHFour",
			onSelect: () => formatting.setLineLocalName("h4"),
		});
		actions.set("h5", {
			label: "Heading 5",
			icon: "TextHFive",
			onSelect: () => formatting.setLineLocalName("h5"),
		});
		actions.set("h6", {
			label: "Heading 6",
			icon: "TextHSix",
			onSelect: () => formatting.setLineLocalName("h6"),
		});
	}

	if (list) {
		actions.set("unordered-list", {
			label: "Bulleted list",
			icon: "ListBullets",
			onSelect: () => list.insert({ localName: "ul" }),
		});
		actions.set("ordered-list", {
			label: "Numbered list",
			icon: "ListNumbers",
			onSelect: () => list.insert({ localName: "ol" }),
		});
	}

	if (todoList) {
		actions.set("todo-list", {
			label: "Todo list",
			icon: "ListChecks",
			onSelect: () => todoList.insert(),
		});
	}

	if (blockQuote) {
		actions.set("block-quote", {
			label: "Blockquote",
			icon: "BlockQuote",
			onSelect: () => blockQuote.insert(),
		});
	}

	if (codeBlock) {
		actions.set("code-block", {
			label: "Code block",
			icon: "CodeBlock",
			onSelect: () =>
				codeBlock.insert({
					language: uiOptions.codeBlock?.defaultLanguage ?? null,
					theme: uiOptions.codeBlock?.defaultTheme ?? null,
				}),
		});
	}

	if (table) {
		actions.set("table", {
			label: "Table",
			icon: "Table",
			onSelect: () =>
				table.insert({
					row: Math.min(5, table.limits.maxRows),
					column: Math.min(5, table.limits.maxCols),
				}),
		});
	}

	if (sourcePlaceholder) {
		actions.set("media", {
			label: "Media",
			icon: "FileArrowUp",
			onSelect: () => sourcePlaceholder.insert(),
		});
	}

	if (accordionItem) {
		actions.set("accordion-item", {
			label: "Accordion item",
			icon: "CaretCircleRight",
			onSelect: () => accordionItem.insert({ attrs: accordionItemAttrs }),
		});
	}

	if (separator) {
		actions.set("separator", {
			label: "Separator",
			icon: "Separator",
			onSelect: () => separator.insert(),
		});
	}

	return actions;
};
