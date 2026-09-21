import type {
	PendingTasks,
	StorageMap,
} from "../../CreateHTMLFromSnapshotView-types";

export interface ResolveBlockComponentParams {
	blockComponentEl: HTMLElement;
	componentName: string | undefined;
	pendingTasks: PendingTasks;
	storageMap: StorageMap;
}
