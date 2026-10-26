import { type JSONPattern, matchJSON } from "#utilities";
import { audioId } from "../_Constants";
import { storageVersion, validateStorage } from "../_Utilities";
import type {
	AudioStorage,
	CreateAudioStorageResult,
	EnsureAudioStorageParams,
	EnsureAudioStorageResult,
	EnsureNodeAudioStorageParams,
	EnsureNodeAudioStorageResult,
} from "./AudioStorage-types";

/*
 * The Audio's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const audioStoragePattern = {
	id: audioId,
	version: storageVersion,
} satisfies JSONPattern<AudioStorage>;

/*
 * Matches a value against audioStoragePattern, returning the first mismatch or null.
 */
export const matchAudioStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: audioStoragePattern });
};

export const isAudioStorage = (storage: unknown): storage is AudioStorage => {
	const mismatch = matchAudioStorage(storage);

	return !mismatch;
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
