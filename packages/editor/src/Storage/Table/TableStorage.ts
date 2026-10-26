import { type JSONPattern, matchJSON } from "#utilities";
import { tableId } from "../_Constants";
import { storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateTableStorageResult,
	EnsureNodeTableStorageParams,
	EnsureNodeTableStorageResult,
	EnsureTableStorageParams,
	EnsureTableStorageResult,
	TableStorage,
} from "./TableStorage-types";

/*
 * The Table's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const tableStoragePattern = {
	id: tableId,
	version: storageVersion,
} satisfies JSONPattern<TableStorage>;

/*
 * Matches a value against tableStoragePattern, returning the first mismatch or null.
 */
export const matchTableStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: tableStoragePattern });
};

export const isTableStorage = (storage: unknown): storage is TableStorage => {
	const mismatch = matchTableStorage(storage);

	return !mismatch;
};

export const validateTableStorage = (
	storage: unknown,
): storage is TableStorage => {
	return validateStorage(storage, isTableStorage);
};

export const createTableStorage = (): CreateTableStorageResult => ({
	id: tableId,
	version: storageVersion,
});

export const ensureTableStorage = ({
	storage,
}: EnsureTableStorageParams): EnsureTableStorageResult => {
	if (validateTableStorage(storage)) {
		return storage;
	}

	return createTableStorage();
};

export const ensureNodeTableStorage = ({
	blockComponent,
}: EnsureNodeTableStorageParams): EnsureNodeTableStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureTableStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
