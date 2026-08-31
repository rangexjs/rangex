import type { BlockComponent } from "rich-text-area";
import type { AccordionItemId } from "../../Constants";
import type { accordionItemStorageVersion } from "./AccordionItemStorage";

export interface AccordionItemStorage {
	id: AccordionItemId;
	version: typeof accordionItemStorageVersion;
}

export interface CreateAccordionItemStorageResult
	extends AccordionItemStorage {}

export interface EnsureAccordionItemStorageParams {
	storage: unknown;
}

export interface EnsureAccordionItemStorageResult
	extends AccordionItemStorage {}

export interface EnsureNodeAccordionItemStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeAccordionItemStorageResult
	extends AccordionItemStorage {}
