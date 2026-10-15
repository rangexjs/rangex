import type { BlockComponent } from "@rangex/core";
import type { EmbedId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type EmbedStorage = {
	id: EmbedId;
	version: typeof storageVersion;
};

export type CreateEmbedStorageResult = EmbedStorage;

export interface EnsureEmbedStorageParams {
	storage: unknown;
}

export type EnsureEmbedStorageResult = EmbedStorage;

export interface EnsureNodeEmbedStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeEmbedStorageResult = EmbedStorage;
