import type { BlockComponent } from "@rangex/core";
import type { TableId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type TableStorage = {
	id: TableId;
	version: typeof storageVersion;
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
