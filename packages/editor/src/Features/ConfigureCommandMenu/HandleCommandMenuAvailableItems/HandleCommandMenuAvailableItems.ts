import type { BlockContentLineLocalName } from "@rangex/core";

import { type CommandMenuItemValue, commandMenuItemValues } from "#adapters/CommandMenu";
import { componentsName } from "#constants";
import { getClosestScopedEditable } from "#engine-links";

import { handleSelectionContextChange } from "../../_Utilities";
import type {
	BlockComponentItems,
	HandleCommandMenuAvailableItemsParams,
	IsItemAvailableParams,
	IsItemAvailableResult,
} from "./HandleCommandMenuAvailableItems-types";

const lineLocalNameItems: CommandMenuItemValue[] = [
	"p",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
] satisfies BlockContentLineLocalName[];

// The component each item inserts
const blockComponentItems: BlockComponentItems = {
	"unordered-list": componentsName.list,
	"ordered-list": componentsName.list,
	"todo-list": componentsName.todoList,
	"block-quote": componentsName.blockQuote,
	"code-block": componentsName.codeBlock,
	table: componentsName.table,
	media: componentsName.sourcePlaceholder,
	"accordion-item": componentsName.accordionItem,
	separator: componentsName.separator,
};

const isLineLocalNameItem = (value: CommandMenuItemValue): value is BlockContentLineLocalName => {
	return lineLocalNameItems.includes(value);
};

/*
 * Whether an item can apply at the selection, by the ScopedEditable directly holding it. A line format needs the
 * Formatting adapter and the line's tag allowed there; a component needs its adapter, and must be insertable into
 * that ScopedEditable itself (see canInsertBySelection's "current" scope): never into a single-line one, such as a
 * code block's line or a caption.
 */
const isItemAvailable = ({
	value,
	adapterBus,
	editorAPI,
	blockComponentPlacement,
}: IsItemAvailableParams): IsItemAvailableResult => {
	if (isLineLocalNameItem(value)) {
		if (!adapterBus.hasAdapter("formatting")) {
			return false;
		}

		const selection = editorAPI.getEditorSelection();

		const { toText } = selection.getBoundaryPoints();

		const scopedEditable = getClosestScopedEditable({ fromNode: toText });

		if (!scopedEditable) {
			return false;
		}

		const { $$allowedContentLineLocalNames } = scopedEditable;

		if ($$allowedContentLineLocalNames === null) {
			return true;
		}

		// With a single allowed tag, every line already has it: there's nothing to switch to
		return (
			$$allowedContentLineLocalNames.length >= 2 && $$allowedContentLineLocalNames.includes(value)
		);
	}

	return blockComponentPlacement.canInsertBySelection({
		scope: "current",
		allowedComponents: [blockComponentItems[value]],
	});
};

/*
 * Keeps the command menu's available items in sync with the selection and the editor content. Returns a cleanup
 * function.
 */
export const handleCommandMenuAvailableItems = ({
	configPort,
	adapterBus,
	editorAPI,
	blockComponentPlacement,
}: HandleCommandMenuAvailableItemsParams) => {
	return handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const availableItems = commandMenuItemValues.filter((value) =>
				isItemAvailable({
					value,
					adapterBus,
					editorAPI,
					blockComponentPlacement,
				}),
			);

			configPort.updateState({ availableItems });
		},
	});
};
