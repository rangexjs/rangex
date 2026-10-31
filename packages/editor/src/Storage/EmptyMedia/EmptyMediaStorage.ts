import { type JSONPattern, matchJSON } from "#utilities";
import { emptyMediaId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateEmptyMediaStorageResult,
	EmptyMediaStorage,
	EnsureEmptyMediaStorageParams,
	EnsureEmptyMediaStorageResult,
	EnsureNodeEmptyMediaStorageParams,
	EnsureNodeEmptyMediaStorageResult,
} from "./EmptyMediaStorage-types";

/*
 * The EmptyMedia's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const emptyMediaStoragePattern = {
	id: emptyMediaId,
} satisfies JSONPattern<EmptyMediaStorage>;

/*
 * Matches a value against emptyMediaStoragePattern, returning the first mismatch or null.
 */
export const matchEmptyMediaStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: emptyMediaStoragePattern });
};

export const isEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage => {
	const mismatch = matchEmptyMediaStorage(storage);

	return !mismatch;
};

export const validateEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage => {
	return validateStorage(storage, isEmptyMediaStorage);
};

export const createEmptyMediaStorage = (): CreateEmptyMediaStorageResult => ({
	id: emptyMediaId,
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
	blockComponent,
}: EnsureNodeEmptyMediaStorageParams): EnsureNodeEmptyMediaStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureEmptyMediaStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
