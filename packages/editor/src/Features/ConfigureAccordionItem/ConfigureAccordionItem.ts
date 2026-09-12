import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemPlacement } from "./HandleAccordionItemPlacement";
import { handleAccordionItemSummaryToggle } from "./HandleAccordionItemSummaryToggle";
import { handleAccordionItemToolbarButtonState } from "./HandleAccordionItemToolbarButtonState";

/*
 * Wires up the accordion item block component: toolbar button state, insert/wrap placement,
 * and summary toggle handling. Returns a cleanup function that tears down all of it.
 */
export const configureAccordionItem = ({
	configPort,
	editorAPI,
}: ConfigureAccordionItemParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleAccordionItemToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleAccordionItemPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const summaryToggleCleanup = handleAccordionItemSummaryToggle({ editorAPI });

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		summaryToggleCleanup();
	};
};
