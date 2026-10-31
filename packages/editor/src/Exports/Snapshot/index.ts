export type { SnapshotLimits, StoredSnapshot } from "@rangex/core";
export { migrateStoredSnapshot } from "@rangex/core";
export { configureSanitizer } from "#sanitizer";
export type {
	SnapshotComponents,
	StorageValidationFailed,
	StorageValidationFailedFallback,
	StorageValidationFailedReject,
	ValidateSnapshotFailed,
	ValidateSnapshotParams,
	ValidateSnapshotResult,
	ValidateSnapshotSucceeded,
	ValidateStorageFn,
	ValidateStorageParams,
	ValidateStorageResult,
} from "#snapshot";
export { validateSnapshot } from "#snapshot";
export type { MentionStorage } from "#storage";
