import { type JSONPattern, matchJSON } from "#utilities";
import { listId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateListStorageResult,
	EnsureListStorageParams,
	EnsureListStorageResult,
	EnsureNodeListStorageParams,
	EnsureNodeListStorageResult,
	ListStorage,
} from "./ListStorage-types";

/*
 * The List's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const listStoragePattern = {
	id: listId,
} satisfies JSONPattern<ListStorage>;

/*
 * Matches a value against listStoragePattern, returning the first mismatch or null.
 */
export const matchListStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: listStoragePattern });
};

export const isListStorage = (storage: unknown): storage is ListStorage => {
	const mismatch = matchListStorage(storage);

	return !mismatch;
};

export const validateListStorage = (
	storage: unknown,
): storage is ListStorage => {
	return validateStorage(storage, isListStorage);
};

export const createListStorage = (): CreateListStorageResult => ({
	id: listId,
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
