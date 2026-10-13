import type { StoredSnapshot } from "@rangex/core";

export interface MigrateIfStoredSnapshotParams {
	storedSnapshot: StoredSnapshot | undefined;
}

export type MigrateIfStoredSnapshotResult = StoredSnapshot | null;

export interface CreateCoreParams {
	licenseKey: string;
	storedSnapshot: StoredSnapshot | undefined;
}
