import { embedId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateEmbedStorageResult,
	EmbedStorage,
	EnsureEmbedStorageParams,
	EnsureEmbedStorageResult,
	EnsureNodeEmbedStorageParams,
	EnsureNodeEmbedStorageResult,
} from "./EmbedStorage-types";

export const isEmbedStorage = (storage: unknown): storage is EmbedStorage => {
	return isStorage(storage, { id: embedId });
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
