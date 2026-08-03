import type { BlockComponent } from "rich-text-area";
import type { EmbedId } from "../../Constants";
import type { embedStorageVersion } from "./EmbedStorage";

export interface EmbedStorage {
	id: EmbedId;
	version: typeof embedStorageVersion;
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
