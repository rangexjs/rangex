import type { BlockComponent } from "@rangex/core";

import type { SourcePlaceholderId } from "../_Constants";

export type SourcePlaceholderStorage = {
	id: SourcePlaceholderId;
};

export type CreateSourcePlaceholderStorageResult = SourcePlaceholderStorage;

export interface EnsureSourcePlaceholderStorageParams {
	storage: unknown;
}

export type EnsureSourcePlaceholderStorageResult = SourcePlaceholderStorage;

export interface EnsureNodeSourcePlaceholderStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeSourcePlaceholderStorageResult = SourcePlaceholderStorage;
