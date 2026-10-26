import type { NodeStorage, ValidateStorageCallbackFn } from "./Utilities-types";

/*
 * Schema version shared by every storage. Bumped on any breaking change to any storage shape.
 */
export const storageVersion = 1 as const;

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

/*
 * Checks whether a value is any node's storage object at the current storage version. Only the shared fields are
 * checked, so the node-specific fields are trusted to match the id.
 */
export const isNodeStorage = (storage: unknown): storage is NodeStorage => {
	const isValidStorage =
		typeof storage === "object" &&
		storage !== null &&
		"id" in storage &&
		typeof storage.id === "string" &&
		"version" in storage &&
		storage.version === storageVersion;

	return isValidStorage;
};
