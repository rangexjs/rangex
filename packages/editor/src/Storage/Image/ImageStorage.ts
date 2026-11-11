import { type JSONPattern, matchJSON } from "#utilities";
import { imageId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateImageStorageResult,
	EnsureImageStorageParams,
	EnsureImageStorageResult,
	EnsureNodeImageStorageParams,
	EnsureNodeImageStorageResult,
	ImageStorage,
} from "./ImageStorage-types";

/*
 * The Image's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const imageStoragePattern = {
	id: imageId,
} satisfies JSONPattern<ImageStorage>;

/*
 * Matches a value against imageStoragePattern, returning the first mismatch or null.
 */
export const matchImageStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: imageStoragePattern });
};

export const isImageStorage = (storage: unknown): storage is ImageStorage => {
	const mismatch = matchImageStorage(storage);

	return !mismatch;
};

export const validateImageStorage = (
	storage: unknown,
): storage is ImageStorage => {
	return validateStorage(storage, isImageStorage);
};

export const createImageStorage = (): CreateImageStorageResult => ({
	id: imageId,
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
