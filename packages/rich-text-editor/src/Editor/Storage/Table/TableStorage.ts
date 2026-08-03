import { tableId } from "../../Constants";
import type {
	CreateTableStorageResult,
	EnsureNodeTableStorageParams,
	EnsureNodeTableStorageResult,
	EnsureTableStorageParams,
	EnsureTableStorageResult,
	TableStorage,
} from "./TableStorage-types";

export const tableStorageVersion = 1 as const;

export const isTableStorage = (storage: unknown): storage is TableStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === tableId &&
	"version" in storage &&
	storage.version === tableStorageVersion;

export const validateTableStorage = (
	storage: unknown,
): storage is TableStorage => {
	const isValid = isTableStorage(storage);

	if (!isValid) {
		console.warn("validateTableStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createTableStorage = (): CreateTableStorageResult => ({
	id: tableId,
	version: tableStorageVersion,
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
