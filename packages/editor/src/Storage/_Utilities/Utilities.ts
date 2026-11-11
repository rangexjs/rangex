import type { NodeStorage, ValidateStorageCallbackFn } from "./Utilities-types";

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
 * Checks whether a value is any node's storage object. Only the shared id is checked, so the node-specific fields are
 * trusted to match it.
 */
export const isNodeStorage = (storage: unknown): storage is NodeStorage => {
	const isValidStorage =
		typeof storage === "object" &&
		storage !== null &&
		"id" in storage &&
		typeof storage.id === "string";

	return isValidStorage;
};
