import type { BlockNestedContext } from "rich-text-area";
import type { EmbedId } from "../../../Constants";
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
	blockNestedContext: BlockNestedContext;
}

export interface EnsureNodeEmbedStorageResult extends EmbedStorage {}
