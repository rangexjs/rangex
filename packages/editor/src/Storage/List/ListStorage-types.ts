import type { BlockComponent } from "@rangex/core";
import type { ListId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type ListStorage = {
	id: ListId;
	version: typeof storageVersion;
};

export type CreateListStorageResult = ListStorage;

export interface EnsureListStorageParams {
	storage: unknown;
}

export type EnsureListStorageResult = ListStorage;

export interface EnsureNodeListStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeListStorageResult = ListStorage;
