import type { SnapshotLimits, StoredSnapshot } from "@rangex/core";

export interface MigrateIfStoredSnapshotParams {
	storedSnapshot: StoredSnapshot | undefined;
	limits: SnapshotLimits;
}

export type MigrateIfStoredSnapshotResult = StoredSnapshot | null;

export interface CreateCoreParams {
	licenseKey: string;
	storedSnapshot: StoredSnapshot | undefined;
	limits: SnapshotLimits;
}
