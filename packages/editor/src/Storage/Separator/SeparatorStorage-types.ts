import type { BlockComponent } from "@rangex/core";
import type { SeparatorId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type SeparatorStorage = {
	id: SeparatorId;
	version: typeof storageVersion;
};

export type CreateSeparatorStorageResult = SeparatorStorage;

export interface EnsureSeparatorStorageParams {
	storage: unknown;
}

export type EnsureSeparatorStorageResult = SeparatorStorage;

export interface EnsureNodeSeparatorStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeSeparatorStorageResult = SeparatorStorage;
