import type { BlockComponent } from "@rangex/core";
import type { EmptyMediaId } from "../_Constants";

export type EmptyMediaStorage = {
	id: EmptyMediaId;
};

export type CreateEmptyMediaStorageResult = EmptyMediaStorage;

export interface EnsureEmptyMediaStorageParams {
	storage: unknown;
}

export type EnsureEmptyMediaStorageResult = EmptyMediaStorage;

export interface EnsureNodeEmptyMediaStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeEmptyMediaStorageResult = EmptyMediaStorage;
