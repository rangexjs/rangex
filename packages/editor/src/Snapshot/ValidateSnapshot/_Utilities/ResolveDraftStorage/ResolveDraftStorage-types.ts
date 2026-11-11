import type { ComponentDraft, RootEditableDraft } from "@rangex/core";
import type { JSONPattern } from "#utilities";
import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

export type DraftStorage = ComponentDraft["customStorage"];

export type StorageDraft = ComponentDraft | RootEditableDraft;

export interface ValidateStorageParams<TStorage extends DraftStorage> {
	storage: TStorage;
}

/*
 * The storage is replaced by the fallback, which must still match the storage pattern
 */
export interface StorageValidationFailedFallback<
	TStorage extends DraftStorage,
> {
	kind: "fallback";
	reason: string;
	value: TStorage;
}

/*
 * The storage can't be fixed: the snapshot is invalid
 */
export interface StorageValidationFailedReject {
	kind: "reject";
	reason: string;
}

export type StorageValidationFailed<TStorage extends DraftStorage> =
	| StorageValidationFailedFallback<TStorage>
	| StorageValidationFailedReject;

export type ValidateStorageResult<TStorage extends DraftStorage> =
	StorageValidationFailed<TStorage> | null;

/*
 * The consumer's own check of a storage. It gets a copy that already matches the storage pattern.
 */
export type ValidateStorageFn<TStorage extends DraftStorage> = (
	params: ValidateStorageParams<TStorage>,
) => ValidateStorageResult<TStorage>;

export interface ResolveDraftStorageParams<TStorage extends DraftStorage> {
	nodeDraft: StorageDraft;
	storagePattern: JSONPattern<TStorage>;
	validateStorage: ValidateStorageFn<TStorage> | undefined;
}

export type ResolveDraftStorageResult = ValidateComponentResult;
