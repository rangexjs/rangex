import type { BlockComponent } from "@rangex/core";

import type { AccordionItemId } from "../_Constants";

export type AccordionItemStorage = {
	id: AccordionItemId;
};

export type CreateAccordionItemStorageResult = AccordionItemStorage;

export interface EnsureAccordionItemStorageParams {
	storage: unknown;
}

export type EnsureAccordionItemStorageResult = AccordionItemStorage;

export interface EnsureNodeAccordionItemStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeAccordionItemStorageResult = AccordionItemStorage;
