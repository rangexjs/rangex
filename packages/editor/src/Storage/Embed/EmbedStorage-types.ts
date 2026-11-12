import type { BlockComponent } from "@rangex/core";

import type { EmbedId } from "../_Constants";

export type EmbedStorage = {
	id: EmbedId;
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
