import type { StorageMap } from "../../../CreateHTMLFromSnapshotView-types";

export interface ResolveTodoListParams {
	todoListEl: HTMLElement;
	storageMap: StorageMap;
}

export type ResolveTodoListResult = Promise<void>;
