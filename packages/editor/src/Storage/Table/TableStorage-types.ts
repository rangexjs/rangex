import type { BlockComponent } from "@rangex/core";

import type { TableId } from "../_Constants";

export type TableStorage = {
	id: TableId;
};

export type CreateTableStorageResult = TableStorage;

export interface EnsureTableStorageParams {
	storage: unknown;
}

export type EnsureTableStorageResult = TableStorage;

export interface EnsureNodeTableStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeTableStorageResult = TableStorage;
