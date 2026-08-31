import type { BlockComponent } from "rich-text-area";
import type { SeparatorId } from "../../Constants";
import type { separatorStorageVersion } from "./SeparatorStorage";

export interface SeparatorStorage {
	id: SeparatorId;
	version: typeof separatorStorageVersion;
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
