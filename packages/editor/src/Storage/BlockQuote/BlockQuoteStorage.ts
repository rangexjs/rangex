import { blockQuoteId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	BlockQuoteStorage,
	CreateBlockQuoteStorageResult,
	EnsureBlockQuoteStorageParams,
	EnsureBlockQuoteStorageResult,
	EnsureNodeBlockQuoteStorageParams,
	EnsureNodeBlockQuoteStorageResult,
} from "./BlockQuoteStorage-types";

export const isBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	return isStorage(storage, { id: blockQuoteId });
};

export const validateBlockQuoteStorage = (
	storage: unknown,
): storage is BlockQuoteStorage => {
	return validateStorage(storage, isBlockQuoteStorage);
};

export const createBlockQuoteStorage = (): CreateBlockQuoteStorageResult => ({
	id: blockQuoteId,
	version: storageVersion,
});

export const ensureBlockQuoteStorage = ({
	storage,
}: EnsureBlockQuoteStorageParams): EnsureBlockQuoteStorageResult => {
	if (validateBlockQuoteStorage(storage)) {
		return storage;
	}

	return createBlockQuoteStorage();
};

export const ensureNodeBlockQuoteStorage = ({
	blockComponent,
}: EnsureNodeBlockQuoteStorageParams): EnsureNodeBlockQuoteStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureBlockQuoteStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
