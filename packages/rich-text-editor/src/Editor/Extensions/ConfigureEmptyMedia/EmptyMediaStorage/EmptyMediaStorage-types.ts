import type { BlockNestedContext } from "rich-text-area";
import type { EmptyMediaId } from "../../../Constants";
import type { emptyMediaStorageVersion } from "./EmptyMediaStorage";

export interface EmptyMediaStorage {
	id: EmptyMediaId;
	version: typeof emptyMediaStorageVersion;
}

export interface CreateEmptyMediaStorageResult extends EmptyMediaStorage {}

export interface EnsureEmptyMediaStorageParams {
	storage: unknown;
}

export interface EnsureEmptyMediaStorageResult extends EmptyMediaStorage {}

export interface EnsureNodeEmptyMediaStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureNodeEmptyMediaStorageResult extends EmptyMediaStorage {}
