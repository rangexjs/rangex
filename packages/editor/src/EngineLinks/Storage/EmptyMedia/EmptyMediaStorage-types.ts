import type { BlockComponent } from "rich-text-area";
import type { EmptyMediaId } from "../../Constants";
import type { storageVersion } from "../_Utilities";

export interface EmptyMediaStorage {
	id: EmptyMediaId;
	version: typeof storageVersion;
}

export interface CreateEmptyMediaStorageResult extends EmptyMediaStorage {}

export interface EnsureEmptyMediaStorageParams {
	storage: unknown;
}

export interface EnsureEmptyMediaStorageResult extends EmptyMediaStorage {}

export interface EnsureNodeEmptyMediaStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeEmptyMediaStorageResult extends EmptyMediaStorage {}
