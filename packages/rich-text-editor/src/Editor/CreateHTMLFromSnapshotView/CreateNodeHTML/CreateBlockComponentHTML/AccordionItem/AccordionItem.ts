import type { ResolveAccordionItemParams } from "./AccordionItem-types";

export const resolveAccordionItem = async ({
	accordionItemEl,
}: ResolveAccordionItemParams): Promise<void> => {
	const detailsEl = accordionItemEl.querySelector("details");

	if (!detailsEl) {
		throw new Error("resolveAccordionItem: details element not found.");
	}

	detailsEl.removeAttribute("open");
};
