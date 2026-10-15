import type { BlockComponent } from "@rangex/core";
import type { BlockQuoteId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type BlockQuoteStorage = {
	id: BlockQuoteId;
	version: typeof storageVersion;
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
