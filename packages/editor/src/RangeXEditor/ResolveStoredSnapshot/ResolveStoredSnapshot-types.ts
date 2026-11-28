import type { FailedStoredSnapshotValidation, StoredSnapshot } from "@rangex/core";

import type { SnapshotSchema } from "#snapshot";

export interface ResolveStoredSnapshotParams {
  storedSnapshot: StoredSnapshot;
  snapshotSchema: SnapshotSchema;
}

export interface ResolveStoredSnapshotSucceeded {
  isValid: true;
  storedSnapshot: StoredSnapshot;
}

export interface ResolveStoredSnapshotFailed {
  isValid: false;
  storedSnapshotFailed: FailedStoredSnapshotValidation;
}

export type ResolveStoredSnapshotResult =
  | ResolveStoredSnapshotSucceeded
  | ResolveStoredSnapshotFailed;
