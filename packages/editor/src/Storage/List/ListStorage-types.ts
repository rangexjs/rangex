import type { BlockComponent } from "@rangex/core";
import type { ListId } from "../_Constants";

export type ListStorage = {
	id: ListId;
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
