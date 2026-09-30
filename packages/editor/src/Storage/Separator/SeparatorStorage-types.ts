import type { BlockComponent } from "@rangex/core";
import type { SeparatorId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface SeparatorStorage {
	id: SeparatorId;
	version: typeof storageVersion;
}

export interface CreateSeparatorStorageResult extends SeparatorStorage {}

export interface EnsureSeparatorStorageParams {
	storage: unknown;
}

export interface EnsureSeparatorStorageResult extends SeparatorStorage {}

export interface EnsureNodeSeparatorStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeSeparatorStorageResult extends SeparatorStorage {}
