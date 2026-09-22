import type {
	LineHandlerPublicPort,
	TurnIntoAvailability,
} from "@rangex/editor";
import type { UIOptions } from "#context";
import type { MenuItem } from "../_Utilities";

interface CreateTurnIntoItemsParams {
	lineHandler: LineHandlerPublicPort;
	uiOptions: UIOptions;
	turnIntoAvailability: TurnIntoAvailability;
}

/*
 * Returns a single-entry array wrapping the "Turn Into" submenu, or an empty array when no
 * target is valid for the current line — so the submenu itself drops out of the menu entirely
 * instead of showing with nothing inside it. Grows by one `if` per component as more turn-into
 * targets become available.
 */
const createTurnIntoItems = ({
	lineHandler,
	uiOptions,
	turnIntoAvailability,
}: CreateTurnIntoItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	if (turnIntoAvailability["accordion-item"]) {
		items.push({
			type: "button",
			label: "Accordion Item",
			icon: "CaretCircleRight",
			onClick: () => lineHandler.turnInto({ name: "accordion-item" }),
		});
	}

	if (turnIntoAvailability["block-quote"]) {
		items.push({
			type: "button",
			label: "Blockquote",
			icon: "BlockQuote",
			onClick: () => lineHandler.turnInto({ name: "block-quote" }),
		});
	}

	if (turnIntoAvailability["code-block"]) {
		items.push({
			type: "button",
			label: "Codeblock",
			icon: "CodeBlock",
			onClick: () =>
				lineHandler.turnInto({
					name: "code-block",
					language: uiOptions.codeBlock.defaultLanguage ?? null,
					theme: uiOptions.codeBlock.defaultTheme ?? null,
				}),
		});
	}

	if (turnIntoAvailability.list) {
		items.push({
			type: "button",
			label: "List",
			icon: "ListBullets",
			onClick: () => lineHandler.turnInto({ name: "list", localName: "ul" }),
		});
	}

	if (turnIntoAvailability["todo-list"]) {
		items.push({
			type: "button",
			label: "Todo List",
			icon: "ListChecks",
			onClick: () => lineHandler.turnInto({ name: "todo-list" }),
		});
	}

	return items;
};

export interface CreateLineDragMenuItemsParams {
	lineHandler: LineHandlerPublicPort;
	uiOptions: UIOptions;
	turnIntoAvailability: TurnIntoAvailability;
	canRemove: boolean;
	canDuplicate: boolean;
	canUnwrap: boolean;
}

export const createLineDragMenuItems = ({
	lineHandler,
	uiOptions,
	turnIntoAvailability,
	canRemove,
	canDuplicate,
	canUnwrap,
}: CreateLineDragMenuItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	const turnIntoItems = createTurnIntoItems({
		lineHandler,
		uiOptions,
		turnIntoAvailability,
	});

	if (turnIntoItems.length) {
		items.push({
			type: "submenu",
			label: "Turn Into",
			icon: "Swap",
			items: turnIntoItems,
		});
	}

	if (canUnwrap) {
		items.push({
			type: "button",
			label: "Unwrap",
			icon: "Export",
			onClick: () => lineHandler.unwrap(),
		});
	}

	if (canRemove) {
		items.push({
			type: "button",
			label: "Delete",
			icon: "Trash",
			onClick: () => lineHandler.remove(),
		});
	}

	if (canDuplicate) {
		items.push({
			type: "button",
			label: "Duplicate",
			icon: "Duplicate",
			onClick: () => lineHandler.duplicate(),
		});
	}

	return items;
};
