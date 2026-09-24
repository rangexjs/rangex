import type { BlockComponent } from "rich-text-area";
import type { TableId } from "../../Constants";
import type { storageVersion } from "../_Utilities";

export interface TableStorage {
	id: TableId;
	version: typeof storageVersion;
}

export interface CreateTableStorageResult extends TableStorage {}

export interface EnsureTableStorageParams {
	storage: unknown;
}

export interface EnsureTableStorageResult extends TableStorage {}

export interface EnsureNodeTableStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeTableStorageResult extends TableStorage {}
