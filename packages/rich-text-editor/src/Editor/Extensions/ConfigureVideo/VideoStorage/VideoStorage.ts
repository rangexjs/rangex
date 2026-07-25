import { videoId } from "../../../Constants";
import type {
	CreateVideoStorageResult,
	EnsureNodeVideoStorageParams,
	EnsureNodeVideoStorageResult,
	EnsureVideoStorageParams,
	EnsureVideoStorageResult,
	VideoStorage,
} from "./VideoStorage-types";

export const videoStorageVersion = 1 as const;

export const isVideoStorage = (storage: unknown): storage is VideoStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === videoId &&
	"version" in storage &&
	storage.version === videoStorageVersion;

export const validateVideoStorage = (
	storage: unknown,
): storage is VideoStorage => {
	const isValid = isVideoStorage(storage);

	if (!isValid) {
		console.warn("validateVideoStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const createVideoStorage = (): CreateVideoStorageResult => ({
	id: videoId,
	version: videoStorageVersion,
});

export const ensureVideoStorage = ({
	storage,
}: EnsureVideoStorageParams): EnsureVideoStorageResult => {
	if (validateVideoStorage(storage)) {
		return storage;
	}

	return createVideoStorage();
};

export const ensureNodeVideoStorage = ({
	blockNestedContext,
}: EnsureNodeVideoStorageParams): EnsureNodeVideoStorageResult => {
	const { $$customStorage } = blockNestedContext;

	const storage = ensureVideoStorage({ storage: $$customStorage });
	blockNestedContext.$$customStorage = storage;

	return storage;
};
