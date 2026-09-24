import { tableId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateTableStorageResult,
	EnsureNodeTableStorageParams,
	EnsureNodeTableStorageResult,
	EnsureTableStorageParams,
	EnsureTableStorageResult,
	TableStorage,
} from "./TableStorage-types";

export const isTableStorage = (storage: unknown): storage is TableStorage => {
	return isStorage(storage, { id: tableId });
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
