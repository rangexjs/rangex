import { rootId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateRootStorageResult,
	EnsureNodeRootStorageParams,
	EnsureNodeRootStorageResult,
	EnsureRootStorageParams,
	EnsureRootStorageResult,
	RootStorage,
} from "./RootStorage-types";

export const isRootStorage = (storage: unknown): storage is RootStorage => {
	return isStorage(storage, { id: rootId });
};

export const validateRootStorage = (
	storage: unknown,
): storage is RootStorage => {
	return validateStorage(storage, isRootStorage);
};

export const createRootStorage = (): CreateRootStorageResult => ({
	id: rootId,
	version: storageVersion,
	templateVariable: {},
});

export const ensureRootStorage = ({
	storage,
}: EnsureRootStorageParams): EnsureRootStorageResult => {
	if (validateRootStorage(storage)) {
		return storage;
	}

	return createRootStorage();
};

export const ensureNodeRootStorage = ({
	rootEditable,
}: EnsureNodeRootStorageParams): EnsureNodeRootStorageResult => {
	const { $$customStorage } = rootEditable;

	const storage = ensureRootStorage({ storage: $$customStorage });
	rootEditable.$$customStorage = storage;

	return storage;
};
