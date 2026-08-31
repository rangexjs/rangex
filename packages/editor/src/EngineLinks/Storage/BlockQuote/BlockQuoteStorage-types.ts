import type { BlockComponent } from "rich-text-area";
import type { BlockQuoteId } from "../../Constants";
import type { blockQuoteStorageVersion } from "./BlockQuoteStorage";

export interface BlockQuoteStorage {
	id: BlockQuoteId;
	version: typeof blockQuoteStorageVersion;
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
