import { rootId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
import type {
	CreateRootStorageResult,
	EnsureNodeRootStorageParams,
	EnsureNodeRootStorageResult,
	EnsureRootStorageParams,
	EnsureRootStorageResult,
	RootStorage,
} from "./RootStorage-types";

export const rootStorageVersion = 1 as const;

export const isRootStorage = (storage: unknown): storage is RootStorage => {
	return isStorage(storage, { id: rootId, version: rootStorageVersion });
};

export const validateRootStorage = (
	storage: unknown,
): storage is RootStorage => {
	return validateStorage(storage, isRootStorage);
};

export const createRootStorage = (): CreateRootStorageResult => ({
	id: rootId,
	version: rootStorageVersion,
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
