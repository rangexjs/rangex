import { handleCaretMenuOverlayAppearance } from "../_Utilities";
import { getCommandMenuQuery } from "./_Utilities";
import type { ConfigureCommandMenuParams } from "./ConfigureCommandMenu-types";
import { handleCommandMenuBeforeSelect } from "./HandleCommandMenuBeforeSelect";

export const configureCommandMenu = ({
	configPort,
	editorAPI,
}: ConfigureCommandMenuParams) => {
	const beforeSelectCleanup = handleCommandMenuBeforeSelect({
		configPort,
		editorAPI,
	});

	const caretMenuCleanup = handleCaretMenuOverlayAppearance({
		port: configPort,
		editorAPI,
		getQuery: getCommandMenuQuery,
		onQuery(query) {
			configPort.updateState({ query });
			return !!configPort.filteredItems.length;
		},
	});

	return () => {
		beforeSelectCleanup();
		caretMenuCleanup();
	};
};
