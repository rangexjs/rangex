import type { StoredSnapshot } from "@rangex/core";

import type { SnapshotSchema, ValidateSnapshotResult } from "#snapshot";

export interface ResolveStoredSnapshotParams {
  storedSnapshot: StoredSnapshot;
  snapshotSchema: SnapshotSchema;
}

export type ResolveStoredSnapshotResult = ValidateSnapshotResult;
