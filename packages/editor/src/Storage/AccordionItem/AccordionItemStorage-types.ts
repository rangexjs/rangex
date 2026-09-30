import type { BlockComponent } from "rich-text-area";
import type { AccordionItemId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface AccordionItemStorage {
	id: AccordionItemId;
	version: typeof storageVersion;
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
