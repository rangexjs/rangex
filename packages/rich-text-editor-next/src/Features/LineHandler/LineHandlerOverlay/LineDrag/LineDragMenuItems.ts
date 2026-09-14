import type {
	LineHandlerPublicPort,
	TurnIntoAvailability,
} from "@rangex/editor";
import type { MenuItem } from "../_Utilities";

interface CreateTurnIntoItemsParams {
	lineHandler: LineHandlerPublicPort;
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
	turnIntoAvailability,
}: CreateTurnIntoItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	if (turnIntoAvailability["accordion-item"]) {
		items.push({
			type: "button",
			label: "Accordion Item",
			icon: "CaretCircleRight",
			onClick: () => lineHandler.turnInto("accordion-item"),
		});
	}

	if (turnIntoAvailability["block-quote"]) {
		items.push({
			type: "button",
			label: "Blockquote",
			icon: "BlockQuote",
			onClick: () => lineHandler.turnInto("block-quote"),
		});
	}

	if (turnIntoAvailability["code-block"]) {
		items.push({
			type: "button",
			label: "Codeblock",
			icon: "CodeBlock",
			onClick: () => lineHandler.turnInto("code-block"),
		});
	}

	if (turnIntoAvailability.list) {
		items.push({
			type: "button",
			label: "List",
			icon: "ListBullets",
			onClick: () => lineHandler.turnInto("list"),
		});
	}

	if (turnIntoAvailability["todo-list"]) {
		items.push({
			type: "button",
			label: "Todo List",
			icon: "ListChecks",
			onClick: () => lineHandler.turnInto("todo-list"),
		});
	}

	return items;
};

export interface CreateLineDragMenuItemsParams {
	lineHandler: LineHandlerPublicPort;
	turnIntoAvailability: TurnIntoAvailability;
	canRemove: boolean;
	canDuplicate: boolean;
	canUnwrap: boolean;
}

export const createLineDragMenuItems = ({
	lineHandler,
	turnIntoAvailability,
	canRemove,
	canDuplicate,
	canUnwrap,
}: CreateLineDragMenuItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	const turnIntoItems = createTurnIntoItems({
		lineHandler,
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
