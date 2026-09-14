import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemPlacement } from "./HandleAccordionItemPlacement";
import { handleAccordionItemPlacementState } from "./HandleAccordionItemPlacementState";
import { handleAccordionItemSummaryToggle } from "./HandleAccordionItemSummaryToggle";

/*
 * Wires up the accordion item block component: toolbar button state, insert/wrap placement,
 * and summary toggle handling. Returns a cleanup function that tears down all of it.
 */
export const configureAccordionItem = ({
	configPort,
	editorAPI,
}: ConfigureAccordionItemParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const placementStateCleanup = handleAccordionItemPlacementState({
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
		placementStateCleanup();
		insertionCleanup();
		summaryToggleCleanup();
	};
};
