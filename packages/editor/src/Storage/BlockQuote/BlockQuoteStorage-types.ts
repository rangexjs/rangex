import type { BlockComponent } from "@rangex/core";
import type { BlockQuoteId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface BlockQuoteStorage {
	id: BlockQuoteId;
	version: typeof storageVersion;
}

export interface CreateBlockQuoteStorageResult extends BlockQuoteStorage {}

export interface EnsureBlockQuoteStorageParams {
	storage: unknown;
}

export interface EnsureBlockQuoteStorageResult extends BlockQuoteStorage {}

export interface EnsureNodeBlockQuoteStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeBlockQuoteStorageResult extends BlockQuoteStorage {}
