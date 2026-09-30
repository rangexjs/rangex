import { componentsName, createBlockComponentPlacement } from "#engine-links";
import { handleComponentUnwrap, handleSelectionComponent } from "../_Utilities";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemPlacement } from "./HandleAccordionItemPlacement";
import { handleAccordionItemPlacementState } from "./HandleAccordionItemPlacementState";
import { handleAccordionItemSummaryToggle } from "./HandleAccordionItemSummaryToggle";

/*
 * Wires up the accordion item block component: toolbar button state, insert/wrap placement,
 * and summary toggle handling. Returns a cleanup function that tears down all of it.
 */
export const configureAccordionItem = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureAccordionItemParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.accordionItem,
	});

	const placementStateCleanup = handleAccordionItemPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		getComponent: () => configPort.currentComponent,
	});

	const insertionCleanup = handleAccordionItemPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const summaryToggleCleanup = handleAccordionItemSummaryToggle({ editorAPI });

	return () => {
		selectionComponentCleanup();
		placementStateCleanup();
		unwrapCleanup();
		insertionCleanup();
		summaryToggleCleanup();
	};
};
