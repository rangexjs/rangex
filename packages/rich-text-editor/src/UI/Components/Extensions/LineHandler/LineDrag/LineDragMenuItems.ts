import type { LineHandlerUIPort, TurnIntoAvailability } from "#adapters";
import { componentsName } from "#ports";
import type { MenuItem } from "../_Utilities";

interface CreateTurnIntoItemsParams {
	uiPort: LineHandlerUIPort;
	turnInto: TurnIntoAvailability;
}

/**
 * Returns a single-entry array wrapping the "Turn Into" submenu, or an empty array when no
 * target is valid for the current line — so the submenu itself drops out of the menu entirely
 * instead of showing with nothing inside it. Grows by one `if` per component as more `create*`
 * functions become available as turn-into targets.
 */
const createTurnIntoItems = ({
	uiPort,
	turnInto,
}: CreateTurnIntoItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	if (turnInto[componentsName.accordionItem]) {
		items.push({
			type: "button",
			label: "Accordion Item",
			icon: "CaretCircleRight",
			checked: () => undefined,
			onClick: () => uiPort.emitTurnInto(componentsName.accordionItem),
		});
	}

	if (turnInto[componentsName.blockQuote]) {
		items.push({
			type: "button",
			label: "Blockquote",
			icon: "BlockQuote",
			checked: () => undefined,
			onClick: () => uiPort.emitTurnInto(componentsName.blockQuote),
		});
	}

	if (turnInto[componentsName.codeBlock]) {
		items.push({
			type: "button",
			label: "Codeblock",
			icon: "CodeBlock",
			checked: () => undefined,
			onClick: () => uiPort.emitTurnInto(componentsName.codeBlock),
		});
	}

	if (turnInto[componentsName.list]) {
		items.push({
			type: "button",
			label: "List",
			icon: "ListBullets",
			checked: () => undefined,
			onClick: () => uiPort.emitTurnInto(componentsName.list),
		});
	}

	if (turnInto[componentsName.todoList]) {
		items.push({
			type: "button",
			label: "Todo List",
			icon: "ListChecks",
			checked: () => undefined,
			onClick: () => uiPort.emitTurnInto(componentsName.todoList),
		});
	}

	return items;
};

export interface CreateLineDragMenuItemsParams {
	uiPort: LineHandlerUIPort;
	turnInto: TurnIntoAvailability;
	canDelete: boolean;
	canDuplicate: boolean;
}

export const createLineDragMenuItems = ({
	uiPort,
	turnInto,
	canDelete,
	canDuplicate,
}: CreateLineDragMenuItemsParams): MenuItem[] => {
	const items: MenuItem[] = [];

	const turnIntoItems = createTurnIntoItems({ uiPort, turnInto });

	if (turnIntoItems.length) {
		items.push({
			type: "submenu",
			label: "Turn Into",
			icon: "Swap",
			items: turnIntoItems,
		});
	}

	if (canDelete) {
		items.push({
			type: "button",
			label: "Delete",
			icon: "Trash",
			checked: () => undefined,
			onClick: () => uiPort.emitDelete(),
		});
	}

	if (canDuplicate) {
		items.push({
			type: "button",
			label: "Duplicate",
			icon: "CopySimple",
			checked: () => undefined,
			onClick: () => uiPort.emitDuplicate(),
		});
	}

	return items;
};
