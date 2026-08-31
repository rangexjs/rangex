import { separatorId } from "../../Constants";
import type {
	CreateSeparatorStorageResult,
	EnsureNodeSeparatorStorageParams,
	EnsureNodeSeparatorStorageResult,
	EnsureSeparatorStorageParams,
	EnsureSeparatorStorageResult,
	SeparatorStorage,
} from "./SeparatorStorage-types";

export const separatorStorageVersion = 1 as const;

export const isSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === separatorId &&
	"version" in storage &&
	storage.version === separatorStorageVersion;

export const validateSeparatorStorage = (
	storage: unknown,
): storage is SeparatorStorage => {
	const isValid = isSeparatorStorage(storage);

	if (!isValid) {
		console.warn("validateSeparatorStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createSeparatorStorage = (): CreateSeparatorStorageResult => ({
	id: separatorId,
	version: separatorStorageVersion,
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
