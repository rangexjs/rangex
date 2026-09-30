import { audioId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	AudioStorage,
	CreateAudioStorageResult,
	EnsureAudioStorageParams,
	EnsureAudioStorageResult,
	EnsureNodeAudioStorageParams,
	EnsureNodeAudioStorageResult,
} from "./AudioStorage-types";

export const isAudioStorage = (storage: unknown): storage is AudioStorage => {
	return isStorage(storage, { id: audioId });
};

export const validateAudioStorage = (
	storage: unknown,
): storage is AudioStorage => {
	return validateStorage(storage, isAudioStorage);
};

export const createAudioStorage = (): CreateAudioStorageResult => ({
	id: audioId,
	version: storageVersion,
});

export const ensureAudioStorage = ({
	storage,
}: EnsureAudioStorageParams): EnsureAudioStorageResult => {
	if (validateAudioStorage(storage)) {
		return storage;
	}

	return createAudioStorage();
};

export const ensureNodeAudioStorage = ({
	blockComponent,
}: EnsureNodeAudioStorageParams): EnsureNodeAudioStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureAudioStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
