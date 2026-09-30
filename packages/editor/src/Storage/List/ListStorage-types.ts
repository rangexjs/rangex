import type { BlockComponent } from "rich-text-area";
import type { ListId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface ListStorage {
	id: ListId;
	version: typeof storageVersion;
}

export interface CreateListStorageResult extends ListStorage {}

export interface EnsureListStorageParams {
	storage: unknown;
}

export interface EnsureListStorageResult extends ListStorage {}

export interface EnsureNodeListStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeListStorageResult extends ListStorage {}
