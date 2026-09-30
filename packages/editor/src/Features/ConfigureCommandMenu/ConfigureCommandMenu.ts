import { handleCaretMenuAppearance } from "../_Utilities";
import { getCommandMenuQuery } from "./_Utilities";
import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleCommandMenuBeforeSelect } from "./HandleCommandMenuBeforeSelect";

/*
 * Wires up the command menu: stripping the triggering /query text before an item is selected,
 * and driving the caret-anchored overlay's query state and visibility. Returns a cleanup function.
 */
export const configureCommandMenu = ({
	configPort,
	editorAPI,
}: ConfigureCommandMenuParams) => {
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
		beforeSelectCleanup();
		caretMenuCleanup();
	};
};
