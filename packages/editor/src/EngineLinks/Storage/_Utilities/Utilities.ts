import type {
	IsStorageParams,
	ValidateStorageCallbackFn,
} from "./Utilities-types";

/*
 * Schema version shared by every storage. Bumped on any breaking change to any storage shape.
 */
export const storageVersion = 1 as const;

/*
 * Checks whether a value is a storage object with the given id at the current storage version.
 */
export const isStorage = (storage: unknown, { id }: IsStorageParams) => {
	const isValidStorage =
		typeof storage === "object" &&
		storage !== null &&
		"id" in storage &&
		storage.id === id &&
		"version" in storage &&
		storage.version === storageVersion;

	return isValidStorage;
};

/*
 * Runs the given storage check and warns when the value has an unexpected shape.
 */
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
