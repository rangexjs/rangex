import { separatorId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateSeparatorStorageResult,
	EnsureNodeSeparatorStorageParams,
	EnsureNodeSeparatorStorageResult,
	EnsureSeparatorStorageParams,
	EnsureSeparatorStorageResult,
	SeparatorStorage,
} from "./SeparatorStorage-types";

export const isSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage => {
	return isStorage(storage, { id: separatorId });
};

export const validateSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage => {
	return validateStorage(storage, isSeparatorStorage);
};

export const createSeparatorStorage = (): CreateSeparatorStorageResult => ({
	id: separatorId,
	version: storageVersion,
});

export const ensureSeparatorStorage = ({
	storage,
}: EnsureSeparatorStorageParams): EnsureSeparatorStorageResult => {
	if (validateSeparatorStorage(storage)) {
		return storage;
	}

	return createSeparatorStorage();
};

export const ensureNodeSeparatorStorage = ({
	blockComponent,
}: EnsureNodeSeparatorStorageParams): EnsureNodeSeparatorStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureSeparatorStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
