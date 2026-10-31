export type { SnapshotLimits, StoredSnapshot } from "@rangex/core";
export { migrateStoredSnapshot } from "@rangex/core";
export type { RootType } from "#constants";
export type { CreateRootAttrValidatorsParams } from "#dom-attrs";
export { configureSanitizer } from "#sanitizer";
export type {
	SnapshotComponents,
	SnapshotRoot,
	SnapshotSchema,
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
export type { MentionStorage, RootStorage } from "#storage";
