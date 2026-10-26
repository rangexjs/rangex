import { type JSONPattern, matchJSON } from "#utilities";
import { embedId } from "../_Constants";
import { storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateEmbedStorageResult,
	EmbedStorage,
	EnsureEmbedStorageParams,
	EnsureEmbedStorageResult,
	EnsureNodeEmbedStorageParams,
	EnsureNodeEmbedStorageResult,
} from "./EmbedStorage-types";

/*
 * The Embed's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const embedStoragePattern = {
	id: embedId,
	version: storageVersion,
} satisfies JSONPattern<EmbedStorage>;

/*
 * Matches a value against embedStoragePattern, returning the first mismatch or null.
 */
export const matchEmbedStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: embedStoragePattern });
};

export const isEmbedStorage = (storage: unknown): storage is EmbedStorage => {
	const mismatch = matchEmbedStorage(storage);

	return !mismatch;
};

export const validateEmbedStorage = (
	storage: unknown,
): storage is EmbedStorage => {
	return validateStorage(storage, isEmbedStorage);
};

export const createEmbedStorage = (): CreateEmbedStorageResult => ({
	id: embedId,
	version: storageVersion,
});

export const ensureEmbedStorage = ({
	storage,
}: EnsureEmbedStorageParams): EnsureEmbedStorageResult => {
	if (validateEmbedStorage(storage)) {
		return storage;
	}

	return createEmbedStorage();
};

export const ensureNodeEmbedStorage = ({
	blockComponent,
}: EnsureNodeEmbedStorageParams): EnsureNodeEmbedStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureEmbedStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
