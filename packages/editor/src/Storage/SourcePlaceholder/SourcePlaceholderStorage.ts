import { type JSONPattern, matchJSON } from "#utilities";

import { sourcePlaceholderId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateSourcePlaceholderStorageResult,
	EnsureNodeSourcePlaceholderStorageParams,
	EnsureNodeSourcePlaceholderStorageResult,
	EnsureSourcePlaceholderStorageParams,
	EnsureSourcePlaceholderStorageResult,
	SourcePlaceholderStorage,
} from "./SourcePlaceholderStorage-types";

/*
 * The SourcePlaceholder's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const sourcePlaceholderStoragePattern = {
	id: sourcePlaceholderId,
} satisfies JSONPattern<SourcePlaceholderStorage>;

/*
 * Matches a value against sourcePlaceholderStoragePattern, returning the first mismatch or null.
 */
export const matchSourcePlaceholderStorage = (storage: unknown) => {
	return matchJSON({
		value: storage,
		pattern: sourcePlaceholderStoragePattern,
	});
};

export const isSourcePlaceholderStorage = (
	storage: unknown,
): storage is SourcePlaceholderStorage => {
	const mismatch = matchSourcePlaceholderStorage(storage);

	return !mismatch;
};

export const validateSourcePlaceholderStorage = (
	storage: unknown,
): storage is SourcePlaceholderStorage => {
	return validateStorage(storage, isSourcePlaceholderStorage);
};

export const createSourcePlaceholderStorage = (): CreateSourcePlaceholderStorageResult => ({
	id: sourcePlaceholderId,
});

export const ensureSourcePlaceholderStorage = ({
	storage,
}: EnsureSourcePlaceholderStorageParams): EnsureSourcePlaceholderStorageResult => {
	if (validateSourcePlaceholderStorage(storage)) {
		return storage;
	}

	return createSourcePlaceholderStorage();
};

export const ensureNodeSourcePlaceholderStorage = ({
	blockComponent,
}: EnsureNodeSourcePlaceholderStorageParams): EnsureNodeSourcePlaceholderStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureSourcePlaceholderStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
