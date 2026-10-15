import type { BlockComponent } from "@rangex/core";
import type { AccordionItemId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type AccordionItemStorage = {
	id: AccordionItemId;
	version: typeof storageVersion;
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
