import type { BlockComponent } from "@rangex/core";

import type { SeparatorId } from "../_Constants";

export type SeparatorStorage = {
	id: SeparatorId;
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
