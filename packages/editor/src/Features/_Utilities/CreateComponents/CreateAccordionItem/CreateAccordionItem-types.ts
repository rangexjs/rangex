import type { BlockComponentLine, Line } from "@rangex/core";
import type { AccordionItemAttrs } from "#dom-attrs";

export interface CreateAccordionItemParams {
	attrs: AccordionItemAttrs;
	childNodes?: Line[];
}

export interface CreateAccordionItemResult extends BlockComponentLine {}
