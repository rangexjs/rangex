import { imageId } from "../../../Constants";
import type {
	CreateImageStorageResult,
	EnsureImageStorageParams,
	EnsureImageStorageResult,
	EnsureNodeImageStorageParams,
	EnsureNodeImageStorageResult,
	ImageStorage,
} from "./ImageStorage-types";

export const imageStorageVersion = 1 as const;

export const isImageStorage = (storage: unknown): storage is ImageStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === imageId &&
	"version" in storage &&
	storage.version === imageStorageVersion;

export const validateImageStorage = (
	storage: unknown,
): storage is ImageStorage => {
	const isValid = isImageStorage(storage);

	if (!isValid) {
		console.warn("validateImageStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createImageStorage = (): CreateImageStorageResult => ({
	id: imageId,
	version: imageStorageVersion,
});

export const ensureImageStorage = ({
	storage,
}: EnsureImageStorageParams): EnsureImageStorageResult => {
	if (validateImageStorage(storage)) {
		return storage;
	}

	return createImageStorage();
};

export const ensureNodeImageStorage = ({
	blockNestedContext,
}: EnsureNodeImageStorageParams): EnsureNodeImageStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureImageStorage({ storage: $$customStorage });
	blockNestedContext.$$customStorage = storage;

	return storage;
};
