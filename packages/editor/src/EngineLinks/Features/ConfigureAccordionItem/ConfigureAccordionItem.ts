import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemInsertion } from "./HandleAccordionItemInsertion";
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

	const insertionCleanup = handleAccordionItemInsertion({
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
