import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureAccordionItemParams } from "./ConfigureAccordionItem-types";
import { handleAccordionItemInsertion } from "./HandleAccordionItemInsertion";
import { handleAccordionItemSummaryToggle } from "./HandleAccordionItemSummaryToggle";
import { handleAccordionItemToolbarButtonState } from "./HandleAccordionItemToolbarButtonState";

export const configureAccordionItem = ({
	editorPort,
	editorAPI,
}: ConfigureAccordionItemParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleAccordionItemToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleAccordionItemInsertion({
		editorPort,
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
