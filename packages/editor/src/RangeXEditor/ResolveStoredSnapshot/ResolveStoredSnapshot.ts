import { type FailedStoredSnapshotValidation, migrateStoredSnapshot } from "@rangex/core";

import { validateSnapshot } from "#snapshot";

import type {
  ResolveStoredSnapshotFailed,
  ResolveStoredSnapshotParams,
  ResolveStoredSnapshotResult,
} from "./ResolveStoredSnapshot-types";

// Keeps only the failure's own fields, without the isValid flag of the result it comes from
const toResolveFailed = ({
  sourceSnapshot,
  failedSnapshot,
  reason,
}: FailedStoredSnapshotValidation): ResolveStoredSnapshotFailed => {
  return {
    isValid: false,
    storedSnapshotFailed: { sourceSnapshot, failedSnapshot, reason },
  };
};

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

    const migrationFailed = toResolveFailed(migrationResult);

    return migrationFailed;
  }

  const validationResult = validateSnapshot({
    ...snapshotSchema,
    storedSnapshot: migrationResult.storedSnapshot,
  });

  if (!validationResult.isValid) {
    console.warn("Snapshot validation failed.", validationResult.reason);

    const validationFailed = toResolveFailed(validationResult);

    return validationFailed;
  }

  return { isValid: true, storedSnapshot: validationResult.storedSnapshot };
};
