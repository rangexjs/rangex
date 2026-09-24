import { emptyMediaId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateEmptyMediaStorageResult,
	EmptyMediaStorage,
	EnsureEmptyMediaStorageParams,
	EnsureEmptyMediaStorageResult,
	EnsureNodeEmptyMediaStorageParams,
	EnsureNodeEmptyMediaStorageResult,
} from "./EmptyMediaStorage-types";

export const isEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage => {
	return isStorage(storage, { id: emptyMediaId });
};

export const validateEmptyMediaStorage = (
	storage: unknown,
): storage is EmptyMediaStorage => {
	return validateStorage(storage, isEmptyMediaStorage);
};

export const createEmptyMediaStorage = (): CreateEmptyMediaStorageResult => ({
	id: emptyMediaId,
	version: storageVersion,
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
