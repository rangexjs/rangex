import { migrateStoredSnapshot } from "@rangex/core";

import { validateSnapshot } from "#snapshot";

import type {
  ResolveStoredSnapshotParams,
  ResolveStoredSnapshotResult,
} from "./ResolveStoredSnapshot-types";

/*
 * Migrates the given snapshot, then validates it by the SnapshotSchema. Resolves to the copy to load, or to the failure
 * if it can't be loaded.
 */
export const resolveStoredSnapshot = ({
  storedSnapshot,
  snapshotSchema,
}: ResolveStoredSnapshotParams): ResolveStoredSnapshotResult => {
  const migrationResult = migrateStoredSnapshot({
    storedSnapshot,
    limits: snapshotSchema.limits,
  });

  if (!migrationResult.isValid) {
    console.warn("Snapshot migration failed.", migrationResult.reason);

    return migrationResult;
  }

  const validationResult = validateSnapshot({
    ...snapshotSchema,
    storedSnapshot: migrationResult.storedSnapshot,
  });

  if (!validationResult.isValid) {
    console.warn("Snapshot validation failed.", validationResult.reason);
  }

  return validationResult;
};
