import { videoId } from "../../Constants";
import { isStorage, validateStorage } from "../_Utilities";
import type {
	CreateVideoStorageResult,
	EnsureNodeVideoStorageParams,
	EnsureNodeVideoStorageResult,
	EnsureVideoStorageParams,
	EnsureVideoStorageResult,
	VideoStorage,
} from "./VideoStorage-types";

export const videoStorageVersion = 1 as const;

export const isVideoStorage = (storage: unknown): storage is VideoStorage => {
	return isStorage(storage, { id: videoId, version: videoStorageVersion });
};

export const validateVideoStorage = (
	storage: unknown,
): storage is VideoStorage => {
	return validateStorage(storage, isVideoStorage);
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
	blockComponent,
}: EnsureNodeVideoStorageParams): EnsureNodeVideoStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureVideoStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
