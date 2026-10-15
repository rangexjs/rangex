import type { BlockComponent } from "@rangex/core";
import type { EmptyMediaId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type EmptyMediaStorage = {
	id: EmptyMediaId;
	version: typeof storageVersion;
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
