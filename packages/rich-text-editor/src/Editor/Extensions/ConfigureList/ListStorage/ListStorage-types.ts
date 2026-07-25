import type { BlockNestedContext } from "rich-text-area";
import type { ListId } from "../../../Constants";
import type { listStorageVersion } from "./ListStorage";

export interface ListStorage {
	id: ListId;
	version: typeof listStorageVersion;
}

export interface CreateListStorageResult extends ListStorage {}

export interface EnsureListStorageParams {
	storage: unknown;
}

export interface EnsureListStorageResult extends ListStorage {}

export interface EnsureNodeListStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureNodeListStorageResult extends ListStorage {}
