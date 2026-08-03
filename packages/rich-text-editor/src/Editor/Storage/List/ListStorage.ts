import { listId } from "../../Constants";
import type {
	CreateListStorageResult,
	EnsureListStorageParams,
	EnsureListStorageResult,
	EnsureNodeListStorageParams,
	EnsureNodeListStorageResult,
	ListStorage,
} from "./ListStorage-types";

export const listStorageVersion = 1 as const;

export const isListStorage = (storage: unknown): storage is ListStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === listId &&
	"version" in storage &&
	storage.version === listStorageVersion;

export const validateListStorage = (
	storage: unknown,
): storage is ListStorage => {
	const isValid = isListStorage(storage);

	if (!isValid) {
		console.warn("validateListStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createListStorage = (): CreateListStorageResult => ({
	id: listId,
	version: listStorageVersion,
});

export const ensureListStorage = ({
	storage,
}: EnsureListStorageParams): EnsureListStorageResult => {
	if (validateListStorage(storage)) {
		return storage;
	}

	return createListStorage();
};

export const ensureNodeListStorage = ({
	blockComponent,
}: EnsureNodeListStorageParams): EnsureNodeListStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureListStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
