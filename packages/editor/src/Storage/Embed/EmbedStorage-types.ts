import type { BlockComponent } from "@rangex/core";
import type { EmbedId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export interface EmbedStorage {
	id: EmbedId;
	version: typeof storageVersion;
}

export interface CreateEmbedStorageResult extends EmbedStorage {}

export interface EnsureEmbedStorageParams {
	storage: unknown;
}

export interface EnsureEmbedStorageResult extends EmbedStorage {}

export interface EnsureNodeEmbedStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeEmbedStorageResult extends EmbedStorage {}
