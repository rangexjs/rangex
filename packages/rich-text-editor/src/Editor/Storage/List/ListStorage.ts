import { listId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
import type {
	CreateListStorageResult,
	EnsureListStorageParams,
	EnsureListStorageResult,
	EnsureNodeListStorageParams,
	EnsureNodeListStorageResult,
	ListStorage,
} from "./ListStorage-types";

export const listStorageVersion = 1 as const;

export const isListStorage = (storage: unknown): storage is ListStorage => {
	return isStorage(storage, { id: listId, version: listStorageVersion });
};

export const validateListStorage = (
	storage: unknown,
): storage is ListStorage => {
	return validateStorage(storage, isListStorage);
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
