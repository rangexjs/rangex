import { imageId } from "../../Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateImageStorageResult,
	EnsureImageStorageParams,
	EnsureImageStorageResult,
	EnsureNodeImageStorageParams,
	EnsureNodeImageStorageResult,
	ImageStorage,
} from "./ImageStorage-types";

export const isImageStorage = (storage: unknown): storage is ImageStorage => {
	return isStorage(storage, { id: imageId });
};

export const validateImageStorage = (
	storage: unknown,
): storage is ImageStorage => {
	return validateStorage(storage, isImageStorage);
};

export const createImageStorage = (): CreateImageStorageResult => ({
	id: imageId,
	version: storageVersion,
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
	blockComponent,
}: EnsureNodeImageStorageParams): EnsureNodeImageStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureImageStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
