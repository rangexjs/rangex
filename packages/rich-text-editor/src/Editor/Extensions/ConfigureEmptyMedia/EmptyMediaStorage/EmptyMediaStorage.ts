import { emptyMediaId } from "../../../Constants";
import type {
	CreateEmptyMediaStorageResult,
	EmptyMediaStorage,
	EnsureEmptyMediaStorageParams,
	EnsureEmptyMediaStorageResult,
	EnsureNodeEmptyMediaStorageParams,
	EnsureNodeEmptyMediaStorageResult,
} from "./EmptyMediaStorage-types";

export const emptyMediaStorageVersion = 1 as const;

export const isEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === emptyMediaId &&
	"version" in storage &&
	storage.version === emptyMediaStorageVersion;

export const validateEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage => {
	const isValid = isEmptyMediaStorage(storage);

	if (!isValid) {
		console.warn("validateEmptyMediaStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createEmptyMediaStorage = (): CreateEmptyMediaStorageResult => ({
	id: emptyMediaId,
	version: emptyMediaStorageVersion,
});

export const ensureEmptyMediaStorage = ({
	storage,
}: EnsureEmptyMediaStorageParams): EnsureEmptyMediaStorageResult => {
	if (validateEmptyMediaStorage(storage)) {
		return storage;
	}

	return createEmptyMediaStorage();
};

export const ensureNodeEmptyMediaStorage = ({
	blockNestedContext,
}: EnsureNodeEmptyMediaStorageParams): EnsureNodeEmptyMediaStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureEmptyMediaStorage({ storage: $$customStorage });
	blockNestedContext.$$customStorage = storage;

	return storage;
};
