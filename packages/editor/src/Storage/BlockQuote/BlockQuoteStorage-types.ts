import type { BlockComponent } from "@rangex/core";
import type { BlockQuoteId } from "../_Constants";

export type BlockQuoteStorage = {
	id: BlockQuoteId;
};

export type CreateBlockQuoteStorageResult = BlockQuoteStorage;

export interface EnsureBlockQuoteStorageParams {
	storage: unknown;
}

export type EnsureBlockQuoteStorageResult = BlockQuoteStorage;

export interface EnsureNodeBlockQuoteStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeBlockQuoteStorageResult = BlockQuoteStorage;
