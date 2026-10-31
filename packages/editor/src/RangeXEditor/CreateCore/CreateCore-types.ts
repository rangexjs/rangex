import type { StoredSnapshot } from "@rangex/core";
import type { SnapshotSchema } from "#snapshot";

export interface ResolveStoredSnapshotParams {
	storedSnapshot: StoredSnapshot | undefined;
	snapshotSchema: SnapshotSchema;
}

export type ResolveStoredSnapshotResult = StoredSnapshot | null;

export interface CreateCoreParams {
	licenseKey: string;
	storedSnapshot: StoredSnapshot | undefined;
	snapshotSchema: SnapshotSchema;
}
