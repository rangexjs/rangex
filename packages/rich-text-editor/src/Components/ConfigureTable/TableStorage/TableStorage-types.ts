import type { BlockNestedContext } from "rich-text-area";
import type { TableId } from "../../../Constants";
import type { tableStorageVersion } from "./TableStorage";

export interface TableStorage {
	id: TableId;
	version: typeof tableStorageVersion;
}

export interface CreateTableStorageResult extends TableStorage {}

export interface EnsureTableStorageParams {
	storage: unknown;
}

export interface EnsureTableStorageResult extends TableStorage {}

export interface EnsureNodeTableStorageParams {
	blockNestedContext: BlockNestedContext;
}

export interface EnsureNodeTableStorageResult extends TableStorage {}
