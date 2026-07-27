import { audioId } from "../../Constants";
import type {
	AudioStorage,
	CreateAudioStorageResult,
	EnsureAudioStorageParams,
	EnsureAudioStorageResult,
	EnsureNodeAudioStorageParams,
	EnsureNodeAudioStorageResult,
} from "./AudioStorage-types";

export const audioStorageVersion = 1 as const;

export const isAudioStorage = (storage: unknown): storage is AudioStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === audioId &&
	"version" in storage &&
	storage.version === audioStorageVersion;

export const validateAudioStorage = (
	storage: unknown,
): storage is AudioStorage => {
	const isValid = isAudioStorage(storage);

	if (!isValid) {
		console.warn("validateAudioStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createAudioStorage = (): CreateAudioStorageResult => ({
	id: audioId,
	version: audioStorageVersion,
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
	blockNestedContext,
}: EnsureNodeAudioStorageParams): EnsureNodeAudioStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureAudioStorage({ storage: $$customStorage });
	blockNestedContext.$$customStorage = storage;

	return storage;
};
