import type {
	StorageFields,
	ValidateStorageCallbackFn,
} from "./Utilities-types";

export const isStorage = (storage: unknown, { id, version }: StorageFields) => {
	const isValidStorage =
		typeof storage === "object" &&
		storage !== null &&
		"id" in storage &&
		storage.id === id &&
		"version" in storage &&
		storage.version === version;

	return isValidStorage;
};

export const validateStorage = (
	storage: unknown,
	isStorage: ValidateStorageCallbackFn,
) => {
	const isValid = isStorage(storage);

	if (!isValid) {
		console.warn("Unexpected data shape", storage);
	}

	return isValid;
};
