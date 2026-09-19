import {
	componentsName,
	createBlockComponentPlacement,
	createComponentLookup,
} from "#engine-links";
import { handleComponentUnwrap } from "../_Utilities";
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
	const componentLookup = createComponentLookup({ editorAPI });
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const placementStateCleanup = handleAccordionItemPlacementState({
		configPort,
		editorAPI,
		componentLookup,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () =>
			componentLookup.closestBlockBySelection({
				components: [componentsName.accordionItem],
			}),
	});

	const insertionCleanup = handleAccordionItemPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const summaryToggleCleanup = handleAccordionItemSummaryToggle({ editorAPI });

	return () => {
		placementStateCleanup();
		unwrapCleanup();
		insertionCleanup();
		summaryToggleCleanup();
	};
};
