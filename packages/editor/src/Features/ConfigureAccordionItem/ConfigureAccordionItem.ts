import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemPlacement } from "./HandleAccordionItemPlacement";
import { handleAccordionItemSummaryToggle } from "./HandleAccordionItemSummaryToggle";
import { handleAccordionItemToolbarButtonState } from "./HandleAccordionItemToolbarButtonState";

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
