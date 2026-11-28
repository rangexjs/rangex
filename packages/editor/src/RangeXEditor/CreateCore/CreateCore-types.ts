import type { EditorAPI, FailedStoredSnapshotValidation, StoredSnapshot } from "@rangex/core";

import type { SnapshotSchema } from "#snapshot";

export interface CreateCoreParams {
  licenseKey: string;
  storedSnapshot: StoredSnapshot | undefined;
  snapshotSchema: SnapshotSchema;
  styles: string;
}

export interface CreateCoreResult {
  editorAPI: EditorAPI;
  storedSnapshotFailed: FailedStoredSnapshotValidation | null;
}

export interface ResolveInitialStoredSnapshotParams {
  storedSnapshot: StoredSnapshot | undefined;
  snapshotSchema: SnapshotSchema;
}

export interface ResolveInitialStoredSnapshotResult {
  resolvedStoredSnapshot: StoredSnapshot | null;
  resolvedStoredSnapshotFailed: FailedStoredSnapshotValidation | null;
}

export interface CreateFallbackRootEditableFnParams {
  snapshotSchema: SnapshotSchema;
}
