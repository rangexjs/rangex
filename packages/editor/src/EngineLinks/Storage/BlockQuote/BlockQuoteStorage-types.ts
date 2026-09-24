import type { BlockComponent } from "rich-text-area";
import type { BlockQuoteId } from "../../Constants";
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
