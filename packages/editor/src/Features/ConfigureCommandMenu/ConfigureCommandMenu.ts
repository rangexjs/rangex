import { createBlockComponentPlacement } from "#engine-links";

import { handleCaretMenuAppearance } from "../_Utilities";
import { getCommandMenuQuery } from "./_Utilities";
import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleCommandMenuAvailableItems } from "./HandleCommandMenuAvailableItems";
import { handleCommandMenuBeforeSelect } from "./HandleCommandMenuBeforeSelect";

/*
 * Wires up the command menu: keeping its available items in sync with the selection, stripping the triggering /query
 * text before an item is selected, and driving the caret-anchored overlay's query state and visibility. Returns a
 * cleanup function.
 */
export const configureCommandMenu = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureCommandMenuParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const availableItemsCleanup = handleCommandMenuAvailableItems({
		configPort,
		adapterBus,
		editorAPI,
		blockComponentPlacement,
	});

	const beforeSelectCleanup = handleCommandMenuBeforeSelect({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuAppearance({
		port: configPort.caretMenu,
		editorAPI,
		getQuery: getCommandMenuQuery,
	});

	return () => {
		availableItemsCleanup();
		beforeSelectCleanup();
		caretMenuCleanup();
	};
};
